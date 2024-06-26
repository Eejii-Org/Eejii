import { ProjectStatus, type ProjectType } from '@/lib/db/enums';
import type { ListResponse, Pagination, Project, User } from '@/lib/types';
import { projectSchema } from '@/lib/validation/project-schema';
import {
  findAllQuerySchema,
  getMyProjectsQuerySchema,
} from '@/lib/validation/query-schema/projectRepositorySchema';
import { TRPCError } from '@trpc/server';
import { sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import slugify from 'slugify';
import { z } from 'zod';
import { createPresignedUrl } from '../helper/imageHelper';
import { sendNotification } from '../helper/notification';
import { getPaginationInfo } from '../helper/paginationInfo';
import {
  selectProjectDetail,
  selectProjectList,
} from '../helper/projectSelector';
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '../trpc';

export const projectRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(findAllQuerySchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.transaction().execute(async trx => {
        const queryResult = await selectProjectList(trx)
          .where('Project.type', '=', input.type)
          .$if(input.title !== undefined, qb =>
            qb.where('title', 'like', '%' + input.title + '%')
          )
          .$if(input.enabled === true, qb =>
            qb.where('enabled', '=', input.enabled)
          )
          .$if(input.featured === true, qb =>
            qb.where('featured', '=', input.featured)
          )
          .$if(input.status !== undefined, qb =>
            qb.where('status', '=', input.status as ProjectStatus)
          )
          .$if(input.partnerId !== undefined, qb =>
            qb.where('ownerId', '=', input.partnerId as string)
          )
          .limit(input.limit)
          .offset(input.limit * (input.page - 1))
          .orderBy('Project.createdAt', input.sort)
          .execute();

        const { count } = await trx
          .selectFrom('Project')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .where('Project.type', '=', input.type as ProjectType)
          .$if(input.title !== undefined, qb =>
            qb.where('title', 'like', '%' + input.title + '%')
          )
          .$if(input.enabled === true, qb =>
            qb.where('enabled', '=', input.enabled)
          )
          .$if(input.featured === true, qb =>
            qb.where('featured', '=', input.featured)
          )
          .$if(input.status !== undefined, qb =>
            qb.where('status', '=', input.status as ProjectStatus)
          )
          .$if(input.partnerId !== undefined, qb =>
            qb.where('ownerId', '=', input.partnerId as string)
          )
          .executeTakeFirstOrThrow();
        return {
          data: queryResult,
          count,
        };
      });

      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: result.count as number,
        limit: input.limit,
        page: input.page,
      });
      const response: ListResponse<Project> = {
        items: result.data as unknown as Project[],
        pagination: paginationInfo,
      };
      return response;
    }),
  getMyProjects: privateProcedure
    .input(getMyProjectsQuerySchema)
    .query(async ({ ctx, input }) => {
      const projects = await selectProjectList(ctx.db)
        .where(eb =>
          eb.and({
            ownerId: ctx.userId,
            type: input.type,
          })
        )
        .$if(input.name !== undefined, qb =>
          qb.where('Project.title', 'like', '%' + input.name + '%')
        )
        .$if(input.status !== undefined, qb =>
          qb.where('Project.status', '=', input.status as ProjectStatus)
        )
        .execute();
      return projects;
    }),
  findBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await selectProjectDetail(ctx.db)
        .where('Project.slug', '=', input.slug)
        .executeTakeFirstOrThrow();
      return project;
    }),
  getMyCollaborated: privateProcedure.query(async ({ ctx }) => {
    const project = await selectProjectList(ctx.db)
      .leftJoin('ProjectCollaborator', join =>
        join.onRef('ProjectCollaborator.projectId', '=', 'Project.id')
      )
      .leftJoin('User', join =>
        join.onRef('User.id', '=', 'ProjectCollaborator.userId')
      )
      .where('User.id', '=', ctx.userId)
      .where('ProjectCollaborator.status', '=', 'REQUEST_APPROVED')
      .execute();
    return project;
  }),
  getMyPending: privateProcedure.query(async ({ ctx }) => {
    const project = await selectProjectList(ctx.db)
      .leftJoin('ProjectCollaborator', join =>
        join.onRef('ProjectCollaborator.projectId', '=', 'Project.id')
      )
      .leftJoin('User', join =>
        join.onRef('User.id', '=', 'ProjectCollaborator.userId')
      )
      .where('User.id', '=', ctx.userId)
      .where('ProjectCollaborator.status', '=', 'REQUEST_PENDING')
      .execute();
    return project;
  }),
  getNotRelated: privateProcedure.query(async ({ ctx }) => {
    const query = await sql`
        SELECT f.* FROM "Project" f
        LEFT JOIN "ProjectCollaborator" fa ON fa."projectId" = f."id"
        WHERE fa."userId" != ${sql.raw(
          `(SELECT u1."id" FROM "User" u1 WHERE u1."id" = '${ctx.userId}')`
        )} OR fa."userId" IS NULL
        AND f."ownerId" != ${sql.raw(
          `(SELECT u1."id" FROM "User" u1 WHERE u1."id" = '${ctx.userId}')`
        )}
      `.execute(ctx.db);
    return query.rows as Project[];
  }),
  findUsersToInvite: publicProcedure // Find all partners for project to invite them
    .input(z.object({ projectId: z.string(), userType: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = await sql`
        SELECT u.*
        FROM "User" u
        LEFT JOIN "ProjectCollaborator" as fa ON fa."userId" = u."id"
        WHERE (fa."projectId" IS DISTINCT FROM ${
          input.projectId
        } OR fa."projectId" IS NULL)
        AND u."id" != ${sql.raw(
          `(SELECT f."ownerId" FROM "Project" AS f WHERE f."id" = '${input.projectId}')`
        )}
        AND u."type" = ${input.userType}
        AND u."id" != ${ctx.userId}
        `.execute(ctx.db);

      return query.rows as User[];
    }),
  create: privateProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db
        .insertInto('Project')
        .values({
          slug: slugify(input.title),
          type: input.type as ProjectType,
          featured: false,
          title: input.title,
          link: input.link,
          description: input.description,
          contact: {
            phone: input.contact.phone,
            email: input.contact.email,
          },
          startTime: input.startTime,
          endTime: input.endTime,
          goalAmount: input.goalAmount,
          ownerId: ctx.userId,
          enabled: false,
          status: ProjectStatus.PENDING,
        })
        .returning(['id', 'title', 'description'])
        .executeTakeFirstOrThrow();

      sendNotification({
        title: `New project request: ${project.title} Eejii.org`,
        link: `/admin/projects/${project.id}`,
        body: project.description,
        receiverId: ctx.userId,
        senderId: ctx.userId,
        type: 'project_request',
      });
      return project;
    }),
  update: privateProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      if (!input.id) {
        throw new TRPCError({
          message: 'Not enough parameter',
          code: 'BAD_REQUEST',
        });
      }
      const project = await ctx.db
        .updateTable('Project')
        .where('id', '=', input.id as string)
        .set({
          title: input.title,
          description: input.description,
          link: input.link,
          contact: {
            phone: input.contact.phone,
            email: input.contact.email,
          },
          startTime: input.startTime,
          endTime: input.endTime,
          goalAmount: input.goalAmount,
          ownerId: ctx.userId,
        })
        .returning(['id', 'slug'])
        .executeTakeFirstOrThrow();

      return project;
    }),
  createPresignedUrl: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        type: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.db
        .selectFrom('ProjectImage')
        .select('id')
        .where('ProjectImage.ownerId', '=', ctx.userId)
        .where('ProjectImage.type', '=', input.type)
        .executeTakeFirst();

      if (exists) {
        ctx.db
          .deleteFrom('ProjectImage')
          .where('ProjectImage.id', '=', exists.id)
          .execute();
      }
      const image = await ctx.db
        .insertInto('ProjectImage')
        .values({
          ownerId: input.projectId,
          type: input.type,
          path: `uploads/project/${input.name}`,
        })
        .returning(['path'])
        .executeTakeFirstOrThrow();

      const res = await createPresignedUrl(image.path, input.contentType);

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
      const project = await ctx.db
        .updateTable('Project')
        .where('Project.id', '=', input.id)
        .set({
          status: state as ProjectStatus,
          enabled: state === ProjectStatus.APPROVED ? true : false,
        })
        .returning(['slug', 'id', 'title', 'ownerId'])
        .executeTakeFirstOrThrow();

      sendNotification({
        title: `Your request to create '#${project.title}' has been ${
          input.status === ProjectStatus.APPROVED ? 'approved' : 'denied'
        }`,
        body: null,
        link: `/p/projects/${project.slug}`,
        receiverId: project.ownerId as string,
        senderId: ctx.userId as string,
        type: 'project_request',
      });
      return project;
    }),

  deleteImage: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .deleteFrom('ProjectImage')
        .where('ProjectImage.id', '=', input.id)
        .execute();
    }),
  findRelated: publicProcedure
    .input(
      z.object({
        limit: z.number().nullish(),
        excludeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const excludeProject = await ctx.db
        .selectFrom('Project')
        .select(['Project.id', 'Project.ownerId'])
        .select(eb => [
          jsonArrayFrom(
            eb
              .selectFrom('CategoryProject')
              .select(['CategoryProject.id'])
              .whereRef('CategoryProject.projectId', '=', 'Project.id')
          ).as('Categories'),
        ])
        .where('id', '=', input.excludeId)
        .executeTakeFirst();
      let query = selectProjectList(ctx.db)
        .leftJoin('CategoryProject', join =>
          join.onRef('CategoryProject.projectId', '=', 'Project.id')
        )
        .leftJoin('Category', join =>
          join.onRef('CategoryProject.categoryId', '=', 'Category.id')
        )
        .where('Project.id', '!=', excludeProject?.id as string);

      if (excludeProject && excludeProject?.Categories?.length > 0) {
        query = query.where(eb =>
          eb.or(
            excludeProject?.Categories?.map(c =>
              eb('CategoryProject.id', '=', c.id)
            )
          )
        );
        query = query.where(eb =>
          eb.or([eb('Project.ownerId', '=', excludeProject.ownerId)])
        );
      }
      if (input.limit) {
        query = query.limit(input.limit);
      }

      const projects = await query
        .orderBy('Project.createdAt desc')
        .groupBy('Project.id')
        .execute();
      return projects;
    }),
  getProjectDonations: publicProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().default(10),
        sortBy: z.enum(['amount', 'date']),
        sort: z.enum(['asc', 'desc']),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .selectFrom('Donation')
        .selectAll('Donation')
        .select(eb => [
          jsonObjectFrom(
            // TODO fetch only needed fields
            eb
              .selectFrom('User')
              .selectAll('User')
              .select(eb2 => [
                jsonArrayFrom(
                  eb2
                    .selectFrom('UserImage')
                    .selectAll()
                    .whereRef('UserImage.ownerId', '=', 'User.id')
                ).as('Images'),
              ])
              .whereRef('User.id', '=', 'Donation.userId')
          ).as('User'),
        ])
        .where('Donation.projectId', '=', input.id);
      if (input.sortBy == 'amount') {
        query = query.orderBy('amount desc');
      } else {
        query = query.orderBy('createdAt desc');
      }
      query = query.limit(input.limit);
      const donations = await query.execute();

      return donations;
    }),
});
