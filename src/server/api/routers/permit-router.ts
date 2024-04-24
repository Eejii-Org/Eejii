import { adminProcedure, createTRPCRouter, privateProcedure } from '../trpc';
import { permitSchema } from '@/lib/validation/mutation-schema/permit-validation-schema';
import { PermitType } from '@/lib/db/enums';
import { z } from 'zod';
import type { ListResponse, Pagination } from '@/lib/types';
import { getPaginationInfo } from '../helper/paginationInfo';

export const permitRouter = createTRPCRouter({
  findById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const permit = await ctx.db
        .selectFrom('Permit')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();
      return permit;
    }),
  findAll: privateProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        type: z.string().nullish().nullable(),
        enabled: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = await ctx.db.transaction().execute(async trx => {
        let permits = trx.selectFrom('Permit').selectAll();
        if (input.type) {
          permits = permits.where('Permit.type', '=', input.type as PermitType);
        }
        if (input.enabled) {
          permits = permits.where('Permit.enabled', '=', input.enabled);
        }
        const data = await permits
          .limit(input.limit)
          .offset((input.page - 1) * input.limit)
          .execute();

        let paginationQuery = trx
          .selectFrom('Permit')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          });
        if (input.enabled) {
          paginationQuery = paginationQuery.where(
            'enabled',
            '=',
            input.enabled
          );
        }
        if (input.type) {
          paginationQuery = paginationQuery.where(
            'type',
            '=',
            input.type as PermitType
          );
        }
        const { count } = await paginationQuery.executeTakeFirstOrThrow();
        return {
          data,
          count,
        };
      });
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: query.count as number,
        limit: input.limit,
        page: input.page,
      });

      const response: ListResponse<Event> = {
        items: query.data as unknown as Event[],
        pagination: paginationInfo,
      };
      return response;
    }),
  createPermit: adminProcedure
    .input(permitSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.positionId) {
        await ctx.db
          .insertInto('Permit')
          .values({
            bannerPositionId: input.positionId as string,
            code: input.code,
            name: input.name,
            description: input.description,
            price: input.price * 100,
            originalPrice: input.originalPrice * 100,
            quantity: input.quantity,
            type: input.type as PermitType,
            enabled: true,
          })
          .executeTakeFirstOrThrow();
      } else {
        await ctx.db
          .insertInto('Permit')
          .values({
            code: input.code,
            name: input.name,
            description: input.description,
            price: input.price * 100,
            originalPrice: input.originalPrice * 100,
            quantity: input.quantity,
            type: input.type as PermitType,
            enabled: true,
          })
          .executeTakeFirstOrThrow();
      }
    }),
  updatePermit: adminProcedure
    .input(permitSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.positionId) {
        await ctx.db
          .updateTable('Permit')
          .where('id', '=', input.id as string)
          .set({
            bannerPositionId: input.positionId as string,
            code: input.code,
            name: input.name,
            description: input.description,
            price: input.price * 100,
            originalPrice: input.originalPrice * 100,
            quantity: input.quantity,
            type: input.type as PermitType,
          })
          .executeTakeFirstOrThrow();
      } else {
        await ctx.db
          .updateTable('Permit')
          .where('id', '=', input.id as string)
          .set({
            code: input.code,
            name: input.name,
            description: input.description,
            price: input.price * 100,
            originalPrice: input.originalPrice * 100,
            quantity: input.quantity,
            type: input.type as PermitType,
          })
          .executeTakeFirstOrThrow();
      }
    }),
  disable: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('Permit')
        .where('id', '=', input.id)
        .set({ enabled: false })
        .executeTakeFirstOrThrow();
    }),
  activate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('Permit')
        .where('id', '=', input.id)
        .set({ enabled: true })
        .executeTakeFirstOrThrow();
    }),
  buyPermit: privateProcedure
    .input(z.object({ permitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const permit = await ctx.db
        .selectFrom('Permit')
        .selectAll()
        .where('id', '=', input.permitId)
        .executeTakeFirstOrThrow();
      ctx.db.transaction().execute(async trx => {
        trx
          .insertInto('PartnerPermit')
          .values({
            userId: ctx.userId,
            permitId: permit.id,
          })
          .executeTakeFirstOrThrow();
        if (permit.type === PermitType.EVENT) {
          await trx
            .updateTable('User')
            .where('id', '=', ctx.userId)
            .set(eb => ({
              eventPermit: eb('eventPermit', '+', permit.quantity),
            }))
            .executeTakeFirstOrThrow();
        } else if (permit.type === PermitType.PROJECT) {
          await trx
            .updateTable('User')
            .where('id', '=', ctx.userId)
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
              userId: ctx.userId,
              active: true,
              startDate: new Date(),
              endDate: endDate,
            })
            .executeTakeFirstOrThrow();
        }
      });
    }),
});
