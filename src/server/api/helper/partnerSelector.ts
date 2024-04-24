import type { DB } from '@/lib/db/types';
import type { Kysely, Transaction } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export const selectPartnerDetail = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('User')
    .selectAll()
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('UserImage')
          .selectAll()
          .whereRef('User.id', '=', 'UserImage.ownerId')
      ).as('Images'),
    ])
    .select(eb1 => [
      jsonObjectFrom(
        eb1
          .selectFrom('PartnerPlan')
          .selectAll('PartnerPlan')
          .select(eb2 => [
            jsonObjectFrom(
              eb2
                .selectFrom('UserPlan')
                .selectAll('UserPlan')
                .whereRef('UserPlan.id', '=', 'PartnerPlan.planId')
            ).as('Plan'),
          ])
          .whereRef('PartnerPlan.id', '=', 'User.partnerPlanId')
      ).as('PartnerPlan'),
    ]);
};

export const selectPartnerList = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('User')
    .where('User.type', '=', 'USER_PARTNER')
    .selectAll('User')
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('UserImage')
          .selectAll()
          .whereRef('User.id', '=', 'UserImage.ownerId')
      ).as('Images'),
    ])
    .select(eb1 => [
      jsonObjectFrom(
        eb1
          .selectFrom('PartnerPlan')
          .selectAll('PartnerPlan')
          .select(eb2 => [
            jsonObjectFrom(
              eb2
                .selectFrom('UserPlan')
                .selectAll('UserPlan')
                .whereRef('UserPlan.id', '=', 'PartnerPlan.planId')
            ).as('Plan'),
          ])
          .whereRef('PartnerPlan.id', '=', 'User.partnerPlanId')
      ).as('PartnerPlan'),
    ]);
};
