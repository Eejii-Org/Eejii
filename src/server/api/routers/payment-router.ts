import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { generate, verify } from '@/lib/paymentProvider';
import { ServerSettings } from '@/lib/server-settings';
import handlePaymentSuccess from '../helper/paymentSuccessHandler';
import { PaymentStatus } from '@/lib/db/enums';

export const paymentRouter = createTRPCRouter({
  createPayment: privateProcedure
    .input(z.object({ paymentMethodCode: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const paymentMethod = await ctx.db
        .selectFrom('PaymentMethod')
        .select('id')
        .where('code', '=', input.paymentMethodCode)
        .executeTakeFirstOrThrow();
      const payment = await ctx.db
        .insertInto('Payment')
        .values({
          userId: input.userId,
          amount: 0,
          status: 'AWAITING_PAYMENT',
          paymentMethodId: paymentMethod.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return payment;
    }),
  checkPayment: privateProcedure
    .input(z.object({ paymentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db
        .selectFrom('Payment')
        .selectAll()
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('PaymentMethod')
              .selectAll('PaymentMethod')
              .whereRef('PaymentMethod.id', '=', 'Payment.paymentMethodId')
          ).as('PaymentMethod'),
        ])
        .where('Payment.id', '=', input.paymentId)
        .executeTakeFirstOrThrow();

      let response;
      switch (payment.PaymentMethod?.code) {
        case ServerSettings.PAYMENT_METHOD.QPAY:
          const invoiceRes = await verify({
            invoiceId: payment.invoiceId as string,
          });

          if (invoiceRes.code === 'success') {
            const data = await ctx.db
              .updateTable('Payment')
              .where('id', '=', input.paymentId)
              .set({
                status: PaymentStatus.PAID,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
            response = { code: PaymentStatus.PAID, payment: data };
          } else {
            await ctx.db
              .updateTable('Payment')
              .where('id', '=', input.paymentId)
              .set({
                status: PaymentStatus.AWAITING_PAYMENT,
              })
              .executeTakeFirstOrThrow();
            response = { code: PaymentStatus.AWAITING_PAYMENT };
          }
          break;
        default:
          throw new TRPCError({
            message: 'Payment method not valid',
            code: 'BAD_REQUEST',
          });
      }
      if (response.code === PaymentStatus.PAID) {
        handlePaymentSuccess(
          response.payment?.id as string,
          response.payment?.userId as string
        );
      }
      return response;
    }),
  buyPermit: privateProcedure
    .input(
      z.object({
        paymentId: z.string(),
        userId: z.string(),
        permitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const permit = await ctx.db
        .selectFrom('Permit')
        .selectAll()
        .where('id', '=', input.permitId)
        .executeTakeFirstOrThrow();
      const exist = await ctx.db
        .selectFrom('Payment')
        .selectAll('Payment')
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('PaymentMethod')
              .selectAll('PaymentMethod')
              .whereRef('PaymentMethod.id', '=', 'Payment.paymentMethodId')
          ).as('PaymentMethod'),
        ])
        .where('id', '=', input.paymentId)
        .executeTakeFirst();
      if (!exist) {
        throw new TRPCError({
          message: 'Payment not found',
          code: 'BAD_REQUEST',
        });
      }
      const response = await ctx.db.transaction().execute(async trx => {
        let payment;
        if (exist.PaymentMethod?.code === ServerSettings.PAYMENT_METHOD.QPAY) {
          const invoice = await generate({
            invoiceNo: exist.id,
            amount: permit.price / 100,
            expireAt: undefined,
          });

          payment = await trx
            .updateTable('Payment')
            .where('id', '=', input.paymentId)
            .set({
              amount: permit.price,
              status: 'AWAITING_PAYMENT',
              permitId: permit.id,
              invoiceId: invoice.invoice_id,
              details: invoice,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        }
        return payment;
      });
      return response;
    }),
  donate: privateProcedure
    .input(
      z.object({
        paymentId: z.string(),
        userId: z.string(),
        projectId: z.string(),
        amount: z.number(),
        isPublicAmount: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db
        .selectFrom('Payment')
        .selectAll('Payment')
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('PaymentMethod')
              .selectAll('PaymentMethod')
              .whereRef('PaymentMethod.id', '=', 'Payment.paymentMethodId')
          ).as('PaymentMethod'),
        ])
        .where('id', '=', input.paymentId)
        .executeTakeFirst();
      if (!exist) {
        throw new TRPCError({
          message: 'Payment not found',
          code: 'BAD_REQUEST',
        });
      }
      const response = await ctx.db.transaction().execute(async trx => {
        let payment;
        if (exist.PaymentMethod?.code === ServerSettings.PAYMENT_METHOD.QPAY) {
          const donation = await trx
            .insertInto('Donation')
            .values({
              amount: input.amount * 100,
              userId: input.userId,
              projectId: input.projectId,
              isPublicAmount: input.isPublicAmount,
            })
            .returning(['id', 'amount'])
            .executeTakeFirstOrThrow();
          const invoice = await generate({
            invoiceNo: exist.id,
            amount: donation.amount / 100,
            expireAt: undefined,
          });
          payment = await trx
            .updateTable('Payment')
            .where('id', '=', input.paymentId)
            .set({
              amount: donation.amount,
              status: 'AWAITING_PAYMENT',
              invoiceId: invoice.invoice_id,
              donationId: donation.id,
              details: invoice,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        }
        return payment;
      });
      return response;
    }),
});
