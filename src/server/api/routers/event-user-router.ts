import { type ProjectStatus, RequestStatus, UserType } from '@/lib/db/enums';
import type { Pagination } from '@/lib/types';
import { RequestType } from '@/lib/types';
import { TRPCError } from '@trpc/server';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { z } from 'zod';
import { sendNotification } from '../helper/notification';
import { getPaginationInfo } from '../helper/paginationInfo';
import { selectVolunteerList } from '../helper/volunteerSelector';
import { createTRPCRouter, privateProcedure } from '../trpc';

export const eventUserRouter = createTRPCRouter({
  findAllEventParticipator: privateProcedure
    .input(
      z.object({
        type: z.string().nullish(),
        status: z.string().nullish(),
        eventStatus: z.string().nullish(),
        userId: z.string().nullish(),
        eventsOwnerId: z.string().nullish(),
        eventId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .selectFrom('EventParticipator')
        .selectAll('EventParticipator')
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('User')
              .selectAll('User')
              .whereRef('User.id', '=', 'EventParticipator.userId')
          ).as('User'),
        ])
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('Event')
              .selectAll('Event')
              .select(eb1 => [
                jsonObjectFrom(
                  eb1
                    .selectFrom('User')
                    .selectAll('User')
                    .select(eb2 => [
                      jsonArrayFrom(
                        eb2
                          .selectFrom('UserImage')
                          .selectAll('UserImage')
                          .whereRef('User.id', '=', 'UserImage.ownerId')
                      ).as('Images'),
                      jsonArrayFrom(
                        eb2
                          .selectFrom('Address')
                          .selectAll('Address')
                          .whereRef('User.id', '=', 'Address.userId')
                      ).as('Addresses'),
                    ])
                    .whereRef('User.id', '=', 'Event.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Event.id', '=', 'EventParticipator.eventId')
          ).as('Event'),
        ]);

      if (input.type) {
        query = query.where('EventParticipator.type', '=', input.type);
      }

      if (input.status) {
        query = query.where(
          'EventParticipator.status',
          '=',
          input.status as RequestStatus
        );
      }

      if (input.userId) {
        query = query.where('EventParticipator.userId', '=', input.userId);
      }

      if (input.eventsOwnerId) {
        query = query
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventParticipator.eventId')
          )
          .where('Event.ownerId', '=', input.eventsOwnerId);
      }
      if (input.eventStatus) {
        query = query
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventParticipator.eventId')
          )
          .where('Event.status', '=', input.eventStatus as ProjectStatus);
      }

      if (input.eventId) {
        query = query.where('EventParticipator.eventId', '=', input.eventId);
      }

      const result = await query.execute();
      return result;
    }),
  findAllCollaborator: privateProcedure
    .input(
      z.object({
        type: z.string().nullish(),
        status: z.string().nullish(),
        userId: z.string().nullish(),
        eventsOwnerId: z.string().nullish(),
        eventId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .selectFrom('EventCollaborator')
        .select([
          'EventCollaborator.id',
          'EventCollaborator.type',
          'EventCollaborator.userId',
          'EventCollaborator.status',
          'EventCollaborator.eventId',
        ])
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('Event')
              .selectAll()
              .whereRef('Event.id', '=', 'EventCollaborator.eventId')
          ).as('Event'),
        ]);
      if (input.type) {
        query = query.where('EventCollaborator.type', '=', input.type);
      }

      if (input.status) {
        query = query.where(
          'EventCollaborator.status',
          '=',
          input.status as RequestStatus
        );
      }

      if (input.userId) {
        query = query.where('EventCollaborator.userId', '=', input.userId);
      }

      if (input.eventsOwnerId) {
        query = query
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventCollaborator.eventId')
          )
          .where('Event.ownerId', '=', input.eventsOwnerId);
      }

      if (input.eventId) {
        query = query.where('EventCollaborator.eventId', '=', input.eventId);
      }

      const result = await query.execute();
      return result;
    }),
  sendParticipateRequest: privateProcedure
    .input(z.object({ eventId: z.string(), roleId: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction().execute(async trx => {
        const event = await trx
          .selectFrom('Event')
          .select(['slug', 'id', 'ownerId', 'title'])
          .where('id', '=', input.eventId)
          .executeTakeFirstOrThrow();

        const exists = await trx
          .selectFrom('EventParticipator')
          .select('id')
          .where('eventId', '=', event.id)
          .where('userId', '=', ctx.userId)
          .executeTakeFirst();

        if (exists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Request already sent',
          });
        }
        await trx
          .insertInto('EventParticipator')
          .values({
            userId: ctx.userId,
            eventId: input.eventId,
            status: RequestStatus.REQUEST_PENDING,
            type: RequestType.REQUEST,
            eventRoleId: input?.roleId ?? null,
          })
          .executeTakeFirstOrThrow();

        sendNotification({
          title: 'New join request',
          body: `You have new join request on event ${event.title}`,
          link: `/p/events/${event.slug}`,
          receiverId: event.ownerId as string,
          senderId: ctx.userId,
          type: 'join_request',
        });
        return;
      });
    }),
  sendCollaborationRequest: privateProcedure
    .input(z.object({ eventId: z.string(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction().execute(async trx => {
        const event = await trx
          .selectFrom('Event')
          .select(['slug', 'id', 'ownerId', 'title'])
          .where('id', '=', input.eventId)
          .executeTakeFirstOrThrow();

        const exists = await trx
          .selectFrom('EventCollaborator')
          .select('id')
          .where('eventId', '=', event.id)
          .where('userId', '=', ctx.userId)
          .executeTakeFirst();

        if (exists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Request already sent',
          });
        }
        await trx
          .insertInto('EventCollaborator')
          .values({
            userId: ctx.userId,
            eventId: input.eventId,
            status: RequestStatus.REQUEST_PENDING,
            type: RequestType.REQUEST,
          })
          .execute();
        sendNotification({
          title: 'New join request',
          body: `You have new join request on event ${event.title}`,
          link: `/p/events/${event.slug}`,
          receiverId: event.ownerId as string,
          senderId: ctx.userId,
          type: 'join_request',
        });
        return;
      });
    }),
  inviteParticipator: privateProcedure // Owner of the fund will invite partner
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction().execute(async trx => {
        const user = await trx
          .selectFrom('User')
          .select(['id', 'email'])
          .where(eb =>
            eb.and({
              id: input.userId,
              type: UserType.USER_VOLUNTEER,
            })
          )
          .executeTakeFirstOrThrow();
        const event = await trx
          .selectFrom('Event')
          .select(['title', 'id', 'slug'])
          .where('id', '=', input.eventId)
          .executeTakeFirstOrThrow();

        await trx
          .insertInto('EventParticipator')
          .values({
            status: RequestStatus.REQUEST_PENDING,
            type: RequestType.INVITATION,
            userId: user.id,
            eventId: event.id,
          })
          .executeTakeFirstOrThrow();
        sendNotification({
          title: `You have invitation`,
          body: `You have invitation to join ${event.title} event`,
          link: `/events/${event.slug}`,
          receiverId: user.id as string,
          senderId: ctx.userId,
          type: 'invite_request',
        });
      });
    }),
  handleParticipantRequest: privateProcedure // Owner of the event will handle the request of it's invitation
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          RequestStatus.REQUEST_DENIED,
          RequestStatus.REQUEST_APPROVED,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const eventParticipator = await ctx.db
        .updateTable('EventParticipator')
        .where('id', '=', input.id)
        .set({
          status: input.status as RequestStatus,
        })
        .returning(expressionBuilder => [
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('Event')
              .select(['id', 'title', 'description'])
              .select(eb => [
                jsonObjectFrom(
                  eb
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Event.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Event.id', '=', 'EventParticipator.eventId')
          ).as('Event'),
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('User')
              .selectAll()
              .whereRef('User.id', '=', 'EventParticipator.userId')
          ).as('User'),
        ])
        .returning(['eventRoleId', 'status'])
        .executeTakeFirstOrThrow();

      if (
        eventParticipator?.eventRoleId &&
        eventParticipator?.status === RequestStatus.REQUEST_APPROVED
      ) {
        await ctx.db
          .updateTable('EventRole')
          .where('id', '=', eventParticipator.eventRoleId)
          .set(eb => ({
            slots: eb('slots', '-', 1),
            accepted: eb('accepted', '+', 1),
          }))
          .returning('id')
          .executeTakeFirstOrThrow();
      }

      const title = eventParticipator.Event
        ? eventParticipator.Event.title
        : 'your project';
      const eventId = eventParticipator.Event
        ? eventParticipator.Event.id
        : null;

      sendNotification({
        title: `Your request to join ${title} has been ${
          input.status === 'REQUEST_APPROVED' ? 'approved' : 'denied'
        }`,
        body: null,
        link: `/events/${eventId}`,
        receiverId: eventParticipator.User?.id as string,
        senderId: ctx.userId as string,
        type: 'join_request',
      });
      return { message: 'Success', response: eventParticipator };
    }),
  handleCollaboratorRequest: privateProcedure // Owner of the event will handle the request of it's invitation
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          RequestStatus.REQUEST_DENIED,
          RequestStatus.REQUEST_APPROVED,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const EventCollaborator = await ctx.db
        .updateTable('EventCollaborator')
        .where('id', '=', input.id)
        .set({
          status: input.status,
        })
        .returning(expressionBuilder => [
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('Event')
              .select(['id', 'title', 'description'])
              .select(eb => [
                jsonObjectFrom(
                  eb
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Event.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Event.id', '=', 'EventCollaborator.eventId')
          ).as('Event'),
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('User')
              .selectAll()
              .whereRef('User.id', '=', 'EventCollaborator.userId')
          ).as('User'),
        ])
        .executeTakeFirstOrThrow();

      const title = EventCollaborator.Event
        ? EventCollaborator.Event.title
        : 'your project';
      const eventId = EventCollaborator.Event
        ? EventCollaborator.Event.id
        : null;

      sendNotification({
        title: `Your request to join ${title} has been ${
          input.status === 'REQUEST_APPROVED' ? 'approved' : 'denied'
        }`,
        body: null,
        link: `/events/${eventId}`,
        receiverId: EventCollaborator.User?.id as string,
        senderId: ctx.userId as string,
        type: 'join_request',
      });
      return { message: 'Success', response: EventCollaborator };
    }),
  getMyVolunteer: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = await ctx.db.transaction().execute(async trx => {
        const volunteers = await selectVolunteerList(trx)
          .select(eb => [
            jsonArrayFrom(
              eb
                .selectFrom('Address')
                .selectAll()
                .whereRef('User.id', '=', 'Address.userId')
            ).as('Addresses'),
          ])
          .select(eb => [
            jsonObjectFrom(
              eb
                .selectFrom('EventParticipator')
                .selectAll()
                .whereRef('User.id', '=', 'EventParticipator.userId')
                .where('EventParticipator.eventId', '=', input.eventId)
            ).as('EventParticipator'),
          ])
          .leftJoin('EventParticipator', join =>
            join.onRef('User.id', '=', 'EventParticipator.userId')
          )
          .leftJoin('Event', join =>
            join
              .onRef('Event.id', '=', 'EventParticipator.eventId')
              .on('Event.id', '=', input.eventId)
          )
          .where(eb =>
            eb.and({
              'User.type': 'USER_VOLUNTEER',
              'Event.ownerId': ctx.userId,
              'EventParticipator.status': 'REQUEST_APPROVED',
            })
          )
          .groupBy('User.id')
          .limit(input.limit)
          .offset(input.limit * (input.page - 1))
          .execute();

        const { count } = await trx
          .selectFrom('User')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .leftJoin('EventParticipator', join =>
            join.onRef('User.id', '=', 'EventParticipator.userId')
          )
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventParticipator.eventId')
          )
          .where(eb =>
            eb.and({
              'User.type': 'USER_VOLUNTEER',
              'Event.ownerId': ctx.userId,
              'EventParticipator.status': 'REQUEST_APPROVED',
              'EventParticipator.eventId': input.eventId,
            })
          )
          .executeTakeFirstOrThrow();

        return {
          data: volunteers,
          count,
        };
      });
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: query.count as number,
        limit: input.limit,
        page: input.page,
      });
      const response = {
        items: query.data,
        pagination: paginationInfo,
      };
      return response;
    }),
  getEventsApplicants: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        limit: z.number().default(20),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = await ctx.db.transaction().execute(async trx => {
        const volunteers = await selectVolunteerList(trx)
          .select(eb => [
            jsonObjectFrom(
              eb
                .selectFrom('EventParticipator')
                .selectAll()
                .whereRef('EventParticipator.userId', '=', 'User.id')
                .where('EventParticipator.eventId', '=', input.eventId)
            ).as('EventParticipator'),
          ])
          .leftJoin('EventParticipator', join =>
            join.onRef('EventParticipator.userId', '=', 'User.id')
          )
          .where(eb =>
            eb.and({
              'EventParticipator.eventId': input.eventId,
              'EventParticipator.status': 'REQUEST_PENDING',
            })
          )
          .groupBy('User.id')
          .limit(input.limit)
          .offset(input.limit * (input.page - 1))
          .execute();

        const { count } = await trx
          .selectFrom('EventParticipator')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .where(eb =>
            eb.and({
              'EventParticipator.eventId': input.eventId,
              'EventParticipator.status': 'REQUEST_PENDING',
            })
          )
          .executeTakeFirstOrThrow();
        return {
          data: volunteers,
          count,
        };
      });
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: query.count as number,
        limit: input.limit,
        page: input.page,
      });
      const response = {
        items: query.data,
        pagination: paginationInfo,
      };
      return response;
    }),
  getOtherVolunteers: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        limit: z.number().default(20),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = await ctx.db.transaction().execute(async trx => {
        const volunteers = await selectVolunteerList(trx)
          .leftJoin('EventParticipator', join =>
            join
              .onRef('EventParticipator.userId', '=', 'User.id')
              .on('EventParticipator.eventId', '=', input.eventId)
          )
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventParticipator.eventId')
          )
          .where(eb =>
            eb.or([
              eb('EventParticipator.id', 'is', null),
              eb(
                'EventParticipator.eventId',
                'is distinct from',
                input.eventId
              ),
            ])
          )
          .where(eb =>
            eb.and({
              'User.requestStatus': 'REQUEST_APPROVED',
              'User.type': 'USER_VOLUNTEER',
            })
          )
          // .where('User.requestStatus', '=', 'REQUEST_APPROVED')
          // .where('User.type', '=', 'USER_VOLUNTEER')
          .groupBy('User.id')
          .limit(input.limit)
          .offset(input.limit * (input.page - 1))
          .execute();

        const { count } = await trx
          .selectFrom('User')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .leftJoin('EventParticipator', join =>
            join
              .onRef('EventParticipator.userId', '=', 'User.id')
              .on('EventParticipator.eventId', '=', input.eventId)
          )
          .leftJoin('Event', join =>
            join.onRef('Event.id', '=', 'EventParticipator.eventId')
          )
          .where(eb =>
            eb.or([
              eb('EventParticipator.id', 'is', null),
              eb(
                'EventParticipator.eventId',
                'is distinct from',
                input.eventId
              ),
            ])
          )
          .where(eb =>
            eb.and({
              'User.requestStatus': 'REQUEST_APPROVED',
              'User.type': 'USER_VOLUNTEER',
            })
          )
          .executeTakeFirstOrThrow();
        return {
          data: volunteers,
          count,
        };
      });
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: query.count as number,
        limit: input.limit,
        page: input.page,
      });
      const response = {
        items: query.data,
        pagination: paginationInfo,
      };
      return response;
    }),
  deleteParticipatorRequest: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const participator = await ctx.db
        .selectFrom('EventParticipator')
        .selectAll('EventParticipator')
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('User')
              .leftJoin('Event', join =>
                join.onRef('Event.id', '=', 'EventParticipator.eventId')
              )
              .select('User.id')
              .whereRef('User.id', '=', 'Event.ownerId')
          ).as('Owner'),
        ])
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();

      if (
        participator.Owner?.id === ctx.userId ||
        participator.userId === ctx.userId
      ) {
        await ctx.db
          .deleteFrom('EventParticipator')
          .where('id', '=', input.id)
          .executeTakeFirstOrThrow();
      }
    }),
  assignPoint: privateProcedure
    .input(z.object({ id: z.string(), point: z.number() }))
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction().execute(async trx => {
        const participator = await trx
          .updateTable('EventParticipator')
          .set({
            volunteeringPoint: input.point,
          })
          .returning(['id', 'userId'])
          .where('id', '=', input.id)
          .executeTakeFirstOrThrow();

        trx
          .updateTable('User')
          .set(eb => ({
            xp: eb('xp', '+', input.point),
          }))
          .where('id', '=', participator.userId);
      });
    }),
});
