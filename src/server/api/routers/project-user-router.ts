import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { z } from 'zod';

import { RequestStatus, UserType } from '@/lib/db/enums';
import { sendNotification } from '../helper/notification';
import { createTRPCRouter, privateProcedure } from '../trpc';

export const projectUserRouter = createTRPCRouter({
  findAll: privateProcedure
    .input(
      z.object({
        type: z.string().nullish(),
        status: z
          .enum([
            RequestStatus.REQUEST_PENDING,
            RequestStatus.REQUEST_DENIED,
            RequestStatus.REQUEST_APPROVED,
          ])
          .nullish(),
        userId: z.string().nullish(),
        fundsOwnerId: z.string().nullish(),
        projectId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .selectFrom('ProjectCollaborator')
        .select([
          'ProjectCollaborator.id',
          'ProjectCollaborator.type',
          'ProjectCollaborator.userId',
          'ProjectCollaborator.status',
          'ProjectCollaborator.projectId',
        ])
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('Project')
              .selectAll()
              .whereRef('Project.id', '=', 'ProjectCollaborator.projectId')
          ).as('Project'),
        ]);
      if (input.type) {
        query = query.where('ProjectCollaborator.type', '=', input.type);
      }

      if (input.status) {
        query = query.where('ProjectCollaborator.status', '=', input.status);
      }

      if (input.userId) {
        query = query.where('ProjectCollaborator.userId', '=', input.userId);
      }

      if (input.fundsOwnerId) {
        query = query
          .leftJoin('Project', join =>
            join.onRef('Project.id', '=', 'ProjectCollaborator.projectId')
          )
          .where('Project.ownerId', '=', input.fundsOwnerId);
      }

      if (input.projectId) {
        query = query.where(
          'ProjectCollaborator.projectId',
          '=',
          input.projectId
        );
      }

      const result = await query.execute();
      return result;
    }),
  handleFundRequest: privateProcedure // Owner of the fund will handle the request of it's invitation
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          RequestStatus.REQUEST_PENDING,
          RequestStatus.REQUEST_DENIED,
          RequestStatus.REQUEST_APPROVED,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ProjectCollaborator = await ctx.db
        .updateTable('ProjectCollaborator')
        .where('id', '=', input.id)
        .set({
          status: input.status,
        })
        .returning(expressionBuilder => [
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('Project')
              .select(['id', 'title'])
              .select(eb => [
                jsonObjectFrom(
                  eb
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Project.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Project.id', '=', 'ProjectCollaborator.projectId')
          ).as('Project'),
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('User')
              .selectAll()
              .whereRef('User.id', '=', 'ProjectCollaborator.userId')
          ).as('User'),
        ])
        .executeTakeFirstOrThrow();

      const projectTitle = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.title
        : 'your project';
      const projectId = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.id
        : null;

      sendNotification({
        title: `Your request to join ${projectTitle} has been ${
          input.status === 'REQUEST_APPROVED' ? 'approved' : 'denied'
        }`,
        body: null,
        link: `/project/${projectId}`,
        receiverId: ProjectCollaborator.User?.id as string,
        senderId: ctx.userId,
        type: 'join_request',
      });
      return { message: 'Success' };
    }),
  inviteToProject: privateProcedure // Owner of the fund will invite partner
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ProjectCollaborator = await ctx.db
        .insertInto('ProjectCollaborator')
        .values({
          status: 'REQUEST_PENDING',
          type: 'invitation',
          userId: input.userId,
          projectId: input.id,
        })
        .returning(expressionBuilder => [
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('Project')
              .select(['id', 'title', 'description'])
              .select(eb => [
                jsonObjectFrom(
                  eb
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Project.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Project.id', '=', 'ProjectCollaborator.projectId')
          ).as('Project'),
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('User')
              .selectAll()
              .whereRef('User.id', '=', 'ProjectCollaborator.userId')
          ).as('User'),
        ])
        .executeTakeFirstOrThrow();
      const ownerName = ProjectCollaborator.Project?.Owner
        ? ProjectCollaborator.Project.Owner.organizationName
        : 'User';
      const projectTitle = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.title
        : 'your project';
      const fundDetail = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.description
        : null;

      const link =
        ProjectCollaborator.User?.type === UserType.USER_PARTNER
          ? '/p/collabration'
          : ProjectCollaborator.User?.type === UserType.USER_SUPPORTER
            ? '/s/collabration'
            : 'unknown';
      sendNotification({
        title: `'${ownerName}' wants you to join '${projectTitle}'`,
        body: fundDetail,
        link: link,
        receiverId: input.userId as string,
        senderId: ctx.userId,
        type: 'invite_request',
      });
      return { message: 'Success' };
    }),
  sendRequest: privateProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ProjectCollaborator = await ctx.db
        .insertInto('ProjectCollaborator')
        .values(({ selectFrom }) => ({
          type: 'request',
          projectId: selectFrom('Project')
            .select('id')
            .where('Project.id', '=', input.projectId),
          userId: selectFrom('User')
            .select('id')
            .where('User.id', '=', ctx.userId),
          status: 'pending',
        }))
        .returning(expressionBuilder => [
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('Project')
              .select(['id', 'title'])
              .select(eb => [
                jsonObjectFrom(
                  eb
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Project.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Project.id', '=', 'ProjectCollaborator.projectId')
          ).as('Project'),
          jsonObjectFrom(
            expressionBuilder
              .selectFrom('User')
              .selectAll()
              .whereRef('User.id', '=', 'ProjectCollaborator.userId')
          ).as('User'),
        ])
        .executeTakeFirstOrThrow();
      const userEmail = ProjectCollaborator.User
        ? ProjectCollaborator.User.email
        : 'User';
      const projectTitle = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.title
        : 'your project';
      const projectId = ProjectCollaborator.Project
        ? ProjectCollaborator.Project.id
        : null;
      sendNotification({
        title: `${userEmail} wants to join ${projectTitle}`,
        body: null,
        link: `/${
          ProjectCollaborator.Project?.Owner?.type === UserType.USER_PARTNER
            ? 'p'
            : 's'
        }/manage/${projectId}`,
        receiverId: ProjectCollaborator.Project?.Owner?.id as string,
        senderId: ctx.userId,
        type: 'join_request',
      });
      return ProjectCollaborator;
    }),
});
