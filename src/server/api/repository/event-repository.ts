import type { EventType, ProjectStatus } from '@/lib/db/enums';
import type { DB } from '@/lib/db/types';
import type { RequestStatus } from '@/lib/types';
import type { Kysely } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type { z } from 'zod';
import type {
  findAllQuerySchema,
  findRelatedQuerySchema,
  getMyEventsQuerySchema,
} from '@/lib/validation/query-schema/eventRepositorySchema';
import { selectEventDetail, selectEventList } from '../helper/eventSelector';

export const eventRepository = {
  findAll: async (
    db: Kysely<DB>,
    params: z.infer<typeof findAllQuerySchema>
  ) => {
    const result = await db.transaction().execute(async trx => {
      let query = selectEventList(trx);
      query = query.where('Event.type', '=', params.type as EventType);
      if (params.title) {
        query = query.where('title', 'like', '%' + params.title + '%');
      }
      if (params.enabled) {
        query = query.where('enabled', '=', params.enabled);
      }
      if (params.featured) {
        query = query.where('featured', '=', params.featured);
      }
      if (params.status) {
        query = query.where('status', '=', params.status as ProjectStatus);
      }
      if (params.partnerId) {
        query = query.where('ownerId', '=', params.partnerId);
      }

      const queryResult = await query
        .limit(params.limit)
        .offset(params.limit * (params.page - 1))
        .orderBy('Event.createdAt', params.sort)
        .execute();
      let paginationQuery = trx
        .selectFrom('Event')
        .select(expressionBuilder => {
          return expressionBuilder.fn.countAll().as('count');
        })
        .where('Event.type', '=', params.type as EventType);

      if (params.title) {
        paginationQuery = paginationQuery.where(
          'title',
          'like',
          '%' + params.title + '%'
        );
      }
      if (params.enabled) {
        paginationQuery = paginationQuery.where('enabled', '=', params.enabled);
      }
      if (params.featured) {
        paginationQuery = paginationQuery.where(
          'featured',
          '=',
          params.featured
        );
      }
      if (params.status) {
        paginationQuery = paginationQuery.where(
          'status',
          '=',
          params.status as ProjectStatus
        );
      }
      if (params.partnerId) {
        paginationQuery = paginationQuery.where(
          'ownerId',
          '=',
          params.partnerId
        );
      }
      const { count } = await paginationQuery.executeTakeFirstOrThrow();
      return {
        data: queryResult,
        count,
      };
    });
    return result;
  },
  getMyEvents: async (
    db: Kysely<DB>,
    params: z.infer<typeof getMyEventsQuerySchema>,
    userId: string
  ) => {
    let query = selectEventList(db)
      .where('type', '=', params.type as EventType)
      .where('ownerId', '=', userId);
    if (params.name) {
      query = query.where('Event.title', 'like', '%' + params.name + '%');
    }
    if (params.status) {
      query = query.where('Event.status', '=', params.status as ProjectStatus);
    }
    return query.execute();
  },
  findBySlug: async (db: Kysely<DB>, slug: string) => {
    const query = selectEventDetail(db);
    return query.where('Event.slug', '=', slug).executeTakeFirstOrThrow();
  },
  getMyCollaborating: async (
    db: Kysely<DB>,
    userId: string,
    params: {
      status: string;
      projectStatus: string;
      page: number;
      limit: number;
    }
  ) => {
    const query = selectEventList(db);
    return query
      .leftJoin('EventCollaborator', join =>
        join.onRef('EventCollaborator.eventId', '=', 'Event.id')
      )
      .leftJoin('User', join =>
        join.onRef('User.id', '=', 'EventCollaborator.userId')
      )
      .where('User.id', '=', userId)
      .where('EventCollaborator.status', '=', params.status as RequestStatus)
      .where('Event.status', '=', params.projectStatus as ProjectStatus)
      .orderBy('EventCollaborator.createdAt asc')
      .offset(params.limit * (params.page - 1))
      .limit(params.limit)
      .execute();
  },
  getMyParticipating: async (
    db: Kysely<DB>,
    userId: string,
    params: {
      status: string;
      projectStatus: string;
      page: number;
      limit: number;
    }
  ) => {
    const query = selectEventList(db);
    return query
      .leftJoin('EventParticipator', join =>
        join.onRef('EventParticipator.eventId', '=', 'Event.id')
      )
      .leftJoin('User', join =>
        join.onRef('User.id', '=', 'EventParticipator.userId')
      )
      .where(eb =>
        eb.and({
          'User.id': userId,
          'EventParticipator.status': params.status as RequestStatus,
          'Event.status': params.projectStatus as ProjectStatus,
        })
      )
      .orderBy('EventParticipator.createdAt asc')
      .offset(params.limit * (params.page - 1))
      .limit(params.limit)
      .execute();
  },
  findRelated: async (
    db: Kysely<DB>,
    params: z.infer<typeof findRelatedQuerySchema>
  ) => {
    const excludeEvent = await db
      .selectFrom('Event')
      .select(['Event.id', 'Event.ownerId'])
      .select(eb => [
        jsonArrayFrom(
          eb
            .selectFrom('Category')
            .selectAll()
            .leftJoin('CategoryEvent', join =>
              join.onRef('CategoryEvent.eventId', '=', 'Event.id')
            )
            .whereRef('CategoryEvent.categoryId', '=', 'Category.id')
        ).as('Categories'),
      ])
      .where('id', '=', params.excludeId)
      .executeTakeFirst();
    let query = selectEventList(db)
      .leftJoin('CategoryEvent', join =>
        join.onRef('CategoryEvent.eventId', '=', 'Event.id')
      )
      .leftJoin('Category', join =>
        join.onRef('CategoryEvent.categoryId', '=', 'Category.id')
      )
      .where('Event.id', '!=', excludeEvent?.id as string);

    if (excludeEvent && excludeEvent?.Categories?.length > 0) {
      query = query.where(eb =>
        eb.or(
          excludeEvent?.Categories?.map(c => eb('CategoryEvent.id', '=', c.id))
        )
      );
      query = query.where(eb =>
        eb.or([eb('Event.ownerId', '=', excludeEvent.ownerId)])
      );
    }
    if (params.limit) {
      query = query.limit(params.limit);
    }

    const res = await query
      .orderBy('Event.createdAt desc')
      .groupBy('Event.id')
      .execute();
    return res;
  },
};
