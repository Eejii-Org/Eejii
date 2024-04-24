import type { DB } from '@/lib/db/types';
import type { findAllQuerySchema } from '@/lib/validation/query-schema/volunteerRepositorySchema';
import type { Kysely } from 'kysely';
import type { z } from 'zod';
import { selectVolunteerList } from '../helper/volunteerSelector';

export const volunteerRepository = {
  findAll: async (
    db: Kysely<DB>,
    input: z.infer<typeof findAllQuerySchema>
  ) => {
    return db.transaction().execute(async trx => {
      let query = selectVolunteerList(trx).where(
        'User.type',
        '=',
        'USER_VOLUNTEER'
      );

      if (input.status) {
        query = query.where('User.requestStatus', '=', input.status);
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
      const volunteers = await query
        .limit(input.limit)
        .offset(input.limit * (input.page - 1))
        .orderBy('User.createdAt desc')
        .execute();

      const { count } = await trx
        .selectFrom('User')
        .select(expressionBuilder => {
          return expressionBuilder.fn.countAll().as('count');
        })
        .where('User.type', '=', 'USER_VOLUNTEER')
        .executeTakeFirstOrThrow();
      return {
        data: volunteers,
        count,
      };
    });
  },
};
