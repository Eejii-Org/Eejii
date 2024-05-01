import { InvoiceStatus, PaymentStatus, PermitType } from '@/lib/db/enums';
import type { DB } from '@/lib/db/types';
import { TRPCError } from '@trpc/server';
import type { Kysely, Transaction } from 'kysely';

async function handlePermit(
  trx: Transaction<DB> | Kysely<DB>,
  permitId: string,
  userId: string
) {
  const permit = await trx
    .selectFrom('Permit')
    .selectAll()
    .where('id', '=', permitId)
    .executeTakeFirstOrThrow();
  if (permit.type === PermitType.EVENT) {
    await trx
      .updateTable('User')
      .where('id', '=', userId)
      .set(eb => ({
        eventPermit: eb('eventPermit', '+', permit.quantity),
      }))
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.PROJECT) {
    await trx
      .updateTable('User')
      .where('id', '=', userId)
      .set(eb => ({
        projectPermit: eb('projectPermit', '+', permit.quantity),
      }))
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.BANNER) {
    const banner = await trx
      .insertInto('Banner')
      .values({
        bannerPositionId: permit.bannerPositionId,
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + permit.quantity);
    await trx
      .insertInto('PartnerBanner')
      .values({
        bannerId: banner.id,
        userId: userId,
        active: true,
        startDate: new Date(),
        endDate: endDate,
      })
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.SUBSCRIPTION) {
    const user = await trx
      .selectFrom('User')
      .select([
        'subscriptionEndsAt',
        'subscriptionId',
        'mediaPermit',
        'eventPermit',
        'projectPermit',
      ])
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();
    const prevSubscription = await trx
      .selectFrom('Subscription')
      .select(['id', 'maxMedia', 'maxEvents', 'maxProjects'])
      .where('id', '=', user.subscriptionId)
      .executeTakeFirst();
    let eventPermit = user.eventPermit;
    let projectPermit = user.projectPermit;
    let mediaPermit = user.mediaPermit;
    if (user.subscriptionId !== permit.subscriptionId) {
      eventPermit = prevSubscription?.maxEvents as number;
      mediaPermit = prevSubscription?.maxMedia as number;
      projectPermit = prevSubscription?.maxProjects as number;
    }
    let date;
    if (user.subscriptionEndsAt) {
      date = new Date(user.subscriptionEndsAt);
    }
    const currentMonth = date?.getMonth();
    await trx
      .updateTable('User')
      .where('id', '=', userId)
      .set({
        subscriptionId: permit.subscriptionId,
        subscriptionEndsAt: new Date(
          currentMonth ?? new Date().getMonth() + permit.quantity
        ),
        mediaPermit: mediaPermit,
        eventPermit: eventPermit,
        projectPermit: projectPermit,
      })
      .executeTakeFirstOrThrow();
  }
}

async function handleDonation(
  trx: Transaction<DB> | Kysely<DB>,
  donationId: string,
  userId: string
) {
  const donation = await trx
    .updateTable('Donation')
    .where('id', '=', donationId)
    .set({
      status: PaymentStatus.PAID,
    })
    .returning(['amount', 'id'])
    .executeTakeFirstOrThrow();
  let invoice = await trx
    .selectFrom('Invoice')
    .select(['id', 'feePercentage'])
    .where(eb =>
      eb.and({
        userId: userId,
        status: InvoiceStatus.NEW,
      })
    )
    .executeTakeFirst();
  if (!invoice) {
    const lastInvoice = await trx
      .selectFrom('Invoice')
      .select('number')
      .orderBy('createdAt asc')
      .executeTakeFirst();
    const number = lastInvoice
      ? (+lastInvoice.number + 1).toString()
      : '000000001';
    invoice = await trx
      .insertInto('Invoice')
      .values({
        userId: userId,
        number: number,
      })
      .returning(['id', 'feePercentage'])
      .executeTakeFirstOrThrow();
  }
  await trx
    .insertInto('InvoiceItem')
    .values({
      invoiceId: invoice.id,
      donationId: donation.id,
      amount: donation.amount.toString(),
    })
    .executeTakeFirstOrThrow();
  const { itemsTotal } = await trx
    .selectFrom('InvoiceItem')
    .select(expressionBuilder => {
      return expressionBuilder.fn.sum('amount').as('itemsTotal');
    })
    .where('invoiceId', '=', invoice?.id)
    .executeTakeFirstOrThrow();
  const fee = (Number(itemsTotal) * invoice.feePercentage) / 100;
  const total = Number(itemsTotal) - fee;

  trx
    .updateTable('Invoice')
    .set({
      itemsTotal: itemsTotal.toString() ?? 0,
      total: total.toString(),
      fee: fee.toString(),
    })
    .executeTakeFirstOrThrow();
}

export default async function handlePaymentSuccess(
  trx: Transaction<DB> | Kysely<DB>,
  paymentId: string,
  userId: string
) {
  const payment = await trx
    .selectFrom('Payment')
    .selectAll()
    .where('id', '=', paymentId)
    .executeTakeFirst();
  if (!payment) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment not found' });
  }

  if (payment.permitId) {
    handlePermit(trx, payment.permitId, userId);
  } else if (payment.donationId) {
    handleDonation(trx, payment.donationId, userId);
  }
}
