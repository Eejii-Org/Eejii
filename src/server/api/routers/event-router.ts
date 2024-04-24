import { TRPCError } from '@trpc/server';
import { sql } from 'kysely';
import { z } from 'zod';

import type { Event, ListResponse, Pagination } from '@/lib/types';
import { eventSchema } from '@/lib/validation/event-schema';

import { EventType } from '@/lib/db/enums';
import { ProjectStatus, RequestStatus } from '@/lib/db/enums';
import { createPresignedUrl } from '../helper/imageHelper';
import { sendNotification } from '../helper/notification';
import { getPaginationInfo } from '../helper/paginationInfo';
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '../trpc';
import slugify from 'slugify';
import { eventRepository } from '../repository/event-repository';
import {
  findAllQuerySchema,
  getMyEventsQuerySchema,
} from '@/lib/validation/query-schema/eventRepositorySchema';

export const eventRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(findAllQuerySchema)
    .query(async ({ input, ctx }) => {
      const result = await eventRepository.findAll(ctx.db, input);
      const totalCount = result.count as number;
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: totalCount,
        limit: input.limit,
        page: input.page,
      });
      const response: ListResponse<Event> = {
        items: result.data as unknown as Event[],
        pagination: paginationInfo,
      };
      return response;
    }),
  findRelated: publicProcedure
    .input(
      z.object({
        limit: z.number().nullish(),
        excludeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await eventRepository.findRelated(ctx.db, input);
      return res;
    }),
  findBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await eventRepository.findBySlug(ctx.db, input.slug);
      return event as unknown as Event;
    }),
  getMyEvents: privateProcedure
    .input(getMyEventsQuerySchema)
    .query(async ({ ctx, input }) => {
      const events = await eventRepository.getMyEvents(
        ctx.db,
        input,
        ctx.userId
      );
      return events as unknown as Event[];
    }),
  getMyCollaborating: privateProcedure
    .input(
      z.object({
        status: z.enum([
          RequestStatus.REQUEST_APPROVED,
          RequestStatus.REQUEST_DENIED,
          RequestStatus.REQUEST_PENDING,
        ]),
        projectStatus: z.enum([
          ProjectStatus.APPROVED,
          ProjectStatus.DENIED,
          ProjectStatus.DONE,
          ProjectStatus.PENDING,
        ]),
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const events = await eventRepository.getMyCollaborating(
        ctx.db,
        ctx.userId,
        input
      );
      return events;
    }),
  getMyParticipating: privateProcedure
    .input(
      z.object({
        status: z.enum([
          RequestStatus.REQUEST_APPROVED,
          RequestStatus.REQUEST_DENIED,
          RequestStatus.REQUEST_PENDING,
        ]),
        projectStatus: z.enum([
          ProjectStatus.APPROVED,
          ProjectStatus.DENIED,
          ProjectStatus.DONE,
          ProjectStatus.PENDING,
        ]),
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const events = await eventRepository.getMyParticipating(
        ctx.db,
        ctx.userId,
        input
      );
      console.log(events);
      return events;
    }),
  getNotRelated: privateProcedure.query(async ({ ctx }) => {
    const query = await sql`
        SELECT e.* FROM "Event" e
        LEFT JOIN "EventCollaborator" ea ON ea."eventId" = e."id"
        WHERE ea."userId" != ${sql.raw(
          `(SELECT u1."id" FROM "User" u1 WHERE u1."id" = '${ctx.userId}')`
        )} OR ea."userId" IS NULL
        AND e."ownerId" != ${sql.raw(
          `(SELECT u1."id" FROM "User" u1 WHERE u1."id" = '${ctx.userId}')`
        )}
      `.execute(ctx.db);
    return query.rows;
  }),
  create: privateProcedure
    .input(eventSchema)
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.transaction().execute(async trx => {
        const partner = await trx
          .selectFrom('User')
          .select(['organizationName', 'id', 'email'])
          .where('id', '=', ctx.userId)
          .executeTakeFirstOrThrow();
        const event = await trx
          .insertInto('Event')
          .values({
            slug: slugify(input.title, { lower: true, strict: true }),
            featured: false,
            type: input.type as EventType,
            title: input.title,
            description: input.description,
            contact: {
              phone: input.contact.phone,
              email: input.contact.email,
            },
            location: input.location,
            startTime: input.startTime,
            endTime: input.endTime,
            maxVolunteers: input.maxVolunteers,
            volunteeringHours: input.volunteeringHours,
            ownerId: ctx.userId,
            enabled: false,
            status: ProjectStatus.PENDING,
          })
          .returning(['id', 'slug', 'title', 'description'])
          .executeTakeFirstOrThrow();

        trx
          .deleteFrom('EventRole')
          .where('eventId', '=', event.id)
          .execute()
          .then(() => {
            if (input.roles && input.roles?.length > 0) {
              input.roles.map(role => {
                trx
                  .insertInto('EventRole')
                  .values({
                    name: role.name,
                    slots: role.slots,
                    eventId: event.id,
                  })
                  .execute();
              });
            }
          });

        if (input.categories) {
          await trx
            .deleteFrom('CategoryEvent')
            .where('CategoryEvent.eventId', '=', event.id)
            .execute();
          input.categories.map(c => {
            trx
              .insertInto('CategoryEvent')
              .values({
                eventId: event.id,
                categoryId: c,
              })
              .execute();
          });
        }
        if (input.type === EventType.VOLUNTEERING) {
          trx
            .insertInto('CertificateTemplate')
            .values({
              description:
                'For outstanding contribution and a effort to the EEJII.ORG volunteering and charity foundation and other partner organizations.',
              shortDescription:
                'For guided at the National Trauma and Orthopaedic researchcenter',
              logoPath: '',
              userId: ctx.userId,
              organizationName: partner.organizationName ?? partner.email,
              eventId: event.id,
            })
            .execute();
        }

        sendNotification({
          title: `New event request: ${event.title} Eejii.org`,
          link: `/admin/events/${event.id}`,
          body: event.description,
          receiverId: ctx.userId,
          senderId: ctx.userId,
          type: 'project_request',
        });
        return event;
      });
      return res;
    }),
  update: privateProcedure
    .input(eventSchema)
    .mutation(async ({ input, ctx }) => {
      const transaction = await ctx.db.transaction().execute(async trx => {
        if (!input.id) {
          throw new TRPCError({
            message: 'Not enough parameter',
            code: 'BAD_REQUEST',
          });
        }
        const event = await trx
          .updateTable('Event')
          .where('id', '=', input.id)
          .set({
            title: input.title,
            description: input.description,
            contact: {
              phone: input.contact.phone,
              email: input.contact.email,
            },
            location: input.location,
            maxVolunteers: input.maxVolunteers,
            volunteeringHours: input.volunteeringHours,
            startTime: input.startTime,
            endTime: input.endTime,
            ownerId: ctx.userId,
          })
          .returning(['slug', 'id'])
          .executeTakeFirstOrThrow();

        trx
          .deleteFrom('EventRole')
          .where('eventId', '=', event.id)
          .execute()
          .then(() => {
            if (input.roles && input.roles?.length > 0) {
              input.roles.map(role => {
                trx
                  .insertInto('EventRole')
                  .values({
                    name: role.name,
                    slots: role.slots,
                    eventId: event.id,
                  })
                  .execute();
              });
            }
          });

        if (input.categories) {
          await trx
            .deleteFrom('CategoryEvent')
            .where('CategoryEvent.eventId', '=', event.id)
            .execute();
          input.categories.map(c => {
            trx
              .insertInto('CategoryEvent')
              .values({
                eventId: event.id,
                categoryId: c,
              })
              .execute();
          });
        }
        return event;
      });
      return transaction;
    }),

  createPresignedUrl: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        type: z.string(),
        name: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.db
        .selectFrom('EventImage')
        .select('id')
        .where('EventImage.ownerId', '=', ctx.userId)
        .where('EventImage.type', '=', input.type)
        .executeTakeFirst();

      if (exists) {
        ctx.db
          .deleteFrom('EventImage')
          .where('EventImage.id', '=', exists.id)
          .execute();
      }
      const eventImage = await ctx.db
        .insertInto('EventImage')
        .values({
          ownerId: input.eventId,
          type: input.type,
          path: `uploads/event/${input.name}`,
        })
        .returning(['path'])
        .executeTakeFirstOrThrow();

      const res = await createPresignedUrl(eventImage.path, input.contentType);

      return {
        data: res,
        fileName: input.name,
      };
    }),

  changeStatus: adminProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let state: string;
      if (input.status === ProjectStatus.APPROVED) {
        state = ProjectStatus.APPROVED;
      } else if (input.status === ProjectStatus.DENIED) {
        state = ProjectStatus.DENIED;
      } else if (input.status === ProjectStatus.DONE) {
        state = ProjectStatus.DONE;
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'NOT VALID REQUEST TYPE',
        });
      }
      const event = await ctx.db
        .updateTable('Event')
        .where('Event.id', '=', input.id)
        .set({
          status: state as ProjectStatus,
          enabled: true,
        })
        .returning(['id', 'title', 'slug', 'ownerId'])
        .executeTakeFirstOrThrow();

      sendNotification({
        title: `Your request to create '#${event.title}' has been ${input.status === ProjectStatus.APPROVED ? 'approved' : 'denied'}`,
        body: null,
        link: `/p/events/${event.slug}`,
        receiverId: event.ownerId as string,
        senderId: ctx.userId as string,
        type: 'project_request',
      });
      return event;
    }),
  deleteImage: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .deleteFrom('EventImage')
        .where('EventImage.id', '=', input.id)
        .execute();
    }),
  updateCertificateTemplate: privateProcedure
    .input(
      z.object({
        description: z.string(),
        organizationName: z.string(),
        shortDescription: z.string(),
        eventId: z.string(),
        imageName: z.string().nullish(),
        imageContentType: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db
        .selectFrom('CertificateTemplate')
        .select('id')
        .where('eventId', '=', input.eventId)
        .executeTakeFirst();
      if (exists) {
        await ctx.db
          .updateTable('CertificateTemplate')
          .where('eventId', '=', input.eventId)
          .set({
            organizationName: input.organizationName,
            description: input.description,
            shortDescription: input.shortDescription,
          })
          .returning(['logoPath', 'id'])
          .executeTakeFirstOrThrow();
      } else {
        await ctx.db
          .insertInto('CertificateTemplate')
          .values({
            organizationName: input.organizationName,
            description: input.description,
            shortDescription: input.shortDescription,
            eventId: input.eventId,
          })
          .returning(['id'])
          .executeTakeFirstOrThrow();
      }
      if (input.imageName && input.imageContentType) {
        ctx.db
          .updateTable('CertificateTemplate')
          .where('eventId', '=', input.eventId)
          .set({
            logoPath: `uploads/logo/${input.imageName}`,
          })
          .execute();
        const res = await createPresignedUrl(
          `uploads/logo/${input.imageName}`,
          input.imageContentType
        );
        return {
          data: res,
          fileName: input.imageName,
        };
      }
      return;
    }),
  getCertificateTemplate: privateProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(input.eventId);
      const template = await ctx.db
        .selectFrom('CertificateTemplate')
        .selectAll()
        .where('eventId', '=', input.eventId)
        .executeTakeFirstOrThrow();
      return template;
    }),
  generateCertificate: privateProcedure
    .input(z.object({ eventId: z.string(), volunteerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db
        .selectFrom('CertificateTemplate')
        .select('id')
        .where('eventId', '=', input.eventId)
        .executeTakeFirstOrThrow();
      const partner = await ctx.db
        .selectFrom('User')
        .select(['id', 'organizationName', 'email'])
        .where('id', '=', ctx.userId)
        .executeTakeFirstOrThrow();
      const volunteer = await ctx.db
        .selectFrom('User')
        .select(['id', 'firstName', 'lastName'])
        .where('id', '=', input.volunteerId)
        .executeTakeFirstOrThrow();

      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
      const counter = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

      const certNumber = `${formattedDate}-${counter}`;
      ctx.db
        .insertInto('Certificate')
        .values({
          organizationName: partner.organizationName ?? partner.email,
          eventId: input.eventId,
          grade: 1,
          number: certNumber,
          certificateTemplateId: template.id,
          volunteerName: volunteer.firstName + ' ' + volunteer.lastName,
          volunteerId: volunteer.id,
        })
        .executeTakeFirst();
      await ctx.db
        .updateTable('EventParticipator')
        .where(eb => eb.and({ eventId: input.eventId, userId: volunteer?.id }))
        .set({ hasCertificate: true })
        .executeTakeFirstOrThrow();
    }),
  calculateMaxPoint: adminProcedure
    .input(z.object({ point: z.number(), eventSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db
        .updateTable('Event')
        .where('slug', '=', input.eventSlug)
        .set({
          maxPoint: input.point,
        })
        .returning(['id', 'slug'])
        .executeTakeFirstOrThrow();
      // TODO SEND EMAIL
      return event;
    }),
});
