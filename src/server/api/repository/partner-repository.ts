import type { DB } from '@/lib/db/types';
import type { RequestStatus } from '@/lib/types';
import type { findAllQuerySchema } from '@/lib/validation/query-schema/partnerRepositorySchema';
import type { Kysely } from 'kysely';
import type { z } from 'zod';
import {
  selectPartnerDetail,
  selectPartnerList,
} from '../helper/partnerSelector';

export const partnerRepository = {
  findById: async (db: Kysely<DB>, input: { id: string }) => {
    const query = selectPartnerDetail(db)
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow();
    return query;
  },
  findAll: async (
    db: Kysely<DB>,
    input: z.infer<typeof findAllQuerySchema>
  ) => {
    const result = await db.transaction().execute(async trx => {
      let query = selectPartnerList(db).where('User.type', '=', 'USER_PARTNER');
      if (input.status) {
        query = query.where(
          'User.requestStatus',
          '=',
          input.status as RequestStatus
        );
      }
      if (input.search) {
        query = query.where(eb =>
          eb.or([
            eb('User.email', 'like', '%' + input.search + '%'),
            eb('User.phoneNumber', 'like', '%' + input.search + '%'),
            eb('User.organizationName', 'like', '%' + input.search + '%'),
            eb('User.firstName', 'like', '%' + input.search + '%'),
            eb('User.lastName', 'like', '%' + input.search + '%'),
          ])
        );
      }
      if (input.plan) {
        query = query
          .leftJoin('PartnerPlan', join =>
            join.onRef('User.partnerPlanId', '=', 'PartnerPlan.id')
          )
          .leftJoin('UserPlan', join =>
            join.onRef('UserPlan.id', '=', 'PartnerPlan.planId')
          )
          .where('UserPlan.code', '=', input.plan);
      }

      const partners = await query
        .limit(input.limit)
        .offset(input.limit * (input.page - 1))
        .groupBy('User.id')
        .orderBy('User.createdAt desc')
        .execute();

      let countQuery = trx
        .selectFrom('User')
        .select(expressionBuilder => {
          return expressionBuilder.fn.countAll().as('count');
        })
        .leftJoin('PartnerPlan', join =>
          join.onRef('User.partnerPlanId', '=', 'PartnerPlan.id')
        )
        .leftJoin('UserPlan', join =>
          join.onRef('UserPlan.id', '=', 'PartnerPlan.planId')
        )
        .where('User.type', '=', 'USER_PARTNER');

      if (input.status) {
        countQuery = countQuery.where(
          'User.requestStatus',
          '=',
          input.status as RequestStatus
        );
      }
      if (input.search) {
        countQuery = countQuery.where(eb =>
          eb.or([
            eb('User.email', 'like', '%' + input.search + '%'),
            eb('User.phoneNumber', 'like', '%' + input.search + '%'),
            eb('User.organizationName', 'like', '%' + input.search + '%'),
            eb('User.firstName', 'like', '%' + input.search + '%'),
            eb('User.lastName', 'like', '%' + input.search + '%'),
          ])
        );
      }
      if (input.plan) {
        countQuery = countQuery.where('UserPlan.code', '=', input.plan);
      }
      const { count } = await countQuery.executeTakeFirstOrThrow();

      return {
        data: partners,
        count,
      };
    });
    return result;
  },
};
