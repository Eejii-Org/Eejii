import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { UserType } from '@/lib/db/enums';
import { RequestStatus } from '@/lib/db/enums';
import { ServerSettings } from '@/lib/server-settings';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '../trpc';
import { hash, verify } from 'argon2';
import emailTemplate from '@/components/mail/emailTemplate';
import handleSendEmail from '@/lib/mailer/sendEmailHelper';
import generateRandomNumber from '../helper/numberGenerator';
import sendEmail from '@/lib/mailer/sendEmail';

export const userRouter = createTRPCRouter({
  getMe: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .selectFrom('User')
      .selectAll('User')
      .select(eb => [
        jsonArrayFrom(
          eb
            .selectFrom('UserImage')
            .selectAll()
            .whereRef('User.id', '=', 'UserImage.ownerId')
        ).as('Images'),
        jsonArrayFrom(
          eb
            .selectFrom('Address')
            .selectAll()
            .whereRef('User.id', '=', 'Address.userId')
        ).as('Addresses'),
      ])
      .where('id', '=', ctx.userId)
      .executeTakeFirstOrThrow();

    return user;
  }),

  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const volunteer = await ctx.db
        .selectFrom('User')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();

      return volunteer;
    }),
  findUsersToInvite: publicProcedure // Find all partners for event to invite them
    .input(z.object({ userType: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = await ctx.db
        .selectFrom('User')
        .selectAll('User')
        .where('User.id', '!=', ctx.userId as string)
        .where('User.type', '=', input.userType as UserType)
        .execute();

      return query;
    }),

  getMyDonations: privateProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const donations = await ctx.db
        .selectFrom('Donation')
        .select(['Donation.id', 'Donation.amount', 'Donation.createdAt'])
        .select(eb => [
          jsonObjectFrom(
            eb
              .selectFrom('Project')
              .selectAll()
              .select(eb2 => [
                jsonObjectFrom(
                  eb2
                    .selectFrom('User')
                    .selectAll()
                    .whereRef('User.id', '=', 'Project.ownerId')
                ).as('Owner'),
              ])
              .whereRef('Project.id', '=', 'Donation.projectId')
          ).as('Project'),
        ])
        .where('userId', '=', ctx.userId)
        .limit(input.limit)
        .execute();

      return donations;
    }),
  changeStatus: adminProcedure
    .input(z.object({ userId: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let state: string;
      if (input.status === RequestStatus.REQUEST_APPROVED) {
        state = RequestStatus.REQUEST_APPROVED;
      } else if (input.status === RequestStatus.REQUEST_DENIED) {
        state = RequestStatus.REQUEST_DENIED;
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'NOT VALID REQUEST TYPE',
        });
      }

      const user = await ctx.db
        .updateTable('User')
        .where('User.id', '=', input.userId)
        .set({ requestStatus: state as RequestStatus })
        .returning([
          'type',
          'id',
          'firstName',
          'lastName',
          'level',
          'organizationName',
          'email',
        ])
        .executeTakeFirstOrThrow();

      const username =
        user.type === UserType.USER_PARTNER
          ? user.organizationName
          : user.firstName + ' ' + user.lastName;
      let template;
      let subject;
      if (state === RequestStatus.REQUEST_APPROVED) {
        subject = ServerSettings.EMAIL.APPROVE_USER(
          user.type === UserType.USER_PARTNER ? true : false,
          username ?? ''
        ).SUBJECT;
        template = emailTemplate(
          ServerSettings.EMAIL.APPROVE_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).GREETINGS,
          ServerSettings.EMAIL.APPROVE_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).BODY,
          ServerSettings.EMAIL.APPROVE_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).NOTE,
          ServerSettings.EMAIL.APPROVE_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).LABEL
        );
      } else if (state === RequestStatus.REQUEST_DENIED) {
        subject = ServerSettings.EMAIL.DENY_USER(
          user.type === UserType.USER_PARTNER ? true : false,
          username ?? ''
        ).SUBJECT;
        template = emailTemplate(
          ServerSettings.EMAIL.DENY_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).GREETINGS,
          ServerSettings.EMAIL.DENY_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).BODY,
          ServerSettings.EMAIL.DENY_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).NOTE,
          ServerSettings.EMAIL.DENY_USER(
            user.type === UserType.USER_PARTNER ? true : false,
            username ?? ''
          ).LABEL
        );
      }
      handleSendEmail(user?.email ?? '', subject ?? '', template?.html ?? '');

      ctx.db
        .insertInto('Notification')
        .values({
          title:
            ServerSettings.NOTIFICATION[
              user.type as keyof typeof ServerSettings.NOTIFICATION
            ].APPROVED_TITLE,
          body: ServerSettings.NOTIFICATION[
            user.type as keyof typeof ServerSettings.NOTIFICATION
          ].APPROVED_BODY,
          receiverId: user.id,
          senderId: ctx.userId,
          status: 'new',
          type: 'request',
        })
        .execute();
      return user;
    }),
  getNotifications: privateProcedure.query(async ({ ctx }) => {
    const notifications = ctx.db
      .selectFrom('Notification')
      .selectAll()
      .where('Notification.receiverId', '=', ctx.userId)
      .orderBy('Notification.updatedAt', 'desc')
      .limit(50)
      .execute();

    return notifications;
  }),
  setSeen: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ctx.db
        .updateTable('Notification')
        .where('id', '=', input.id)
        .set({
          status: 'seen',
          updatedAt: new Date(),
        })
        .execute();
    }),
  deleteImage: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .deleteFrom('UserImage')
        .where('UserImage.id', '=', input.id)
        .execute();
    }),
  passwordChange: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        newPassword: z.string(),
        oldPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .selectFrom('User')
        .select(['id', 'password'])
        .where('id', '=', input.userId as unknown as string)
        .executeTakeFirstOrThrow();
      const currentPassword = user?.password;
      const newPassword = await hash(input.newPassword);
      verify(currentPassword as string, input.oldPassword)
        .then(() => {
          ctx.db
            .updateTable('User')
            .where('id', '=', user?.id as unknown as string)
            .set({ password: newPassword })
            .execute();
        })
        .catch(() => {
          return new TRPCError({
            message: 'Password doesnt match',
            code: 'BAD_REQUEST',
          });
        });
    }),
  sendVerifyEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = generateRandomNumber(6);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);

      const emailExists = await ctx.db
        .selectFrom('UserEmailVerification')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirst();
      let user;
      if (!emailExists) {
        user = await ctx.db
          .insertInto('UserEmailVerification')
          .values({
            email: input.email,
            expiresAt: now,
            token: token.toString(),
          })
          .returning(['email', 'token'])
          .executeTakeFirstOrThrow();
      } else {
        user = await ctx.db
          .updateTable('UserEmailVerification')
          .set({
            email: input.email,
            expiresAt: now,
            token: token.toString(),
          })
          .returning(['email', 'token'])
          .executeTakeFirstOrThrow();
      }

      const template = emailTemplate(
        ServerSettings.EMAIL.VERIFICATION_EMAIL(user.token).GREETINGS,
        ServerSettings.EMAIL.VERIFICATION_EMAIL(user.token).BODY,
        ServerSettings.EMAIL.VERIFICATION_EMAIL(user.token).NOTE,
        ServerSettings.EMAIL.VERIFICATION_EMAIL(user.token).LABEL
      );
      const emailRes = await sendEmail(
        user.email,
        ServerSettings.EMAIL.VERIFICATION_EMAIL(user.token).SUBJECT,
        template.html
      );
      if (!emailRes) {
        throw new TRPCError({
          message: 'Sorry, error while sending email',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ email: z.string(), token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .selectFrom('UserEmailVerification')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirstOrThrow();
      const now = new Date();
      if (
        typeof user.expiresAt !== 'object' ||
        !(user.expiresAt instanceof Date)
      ) {
        throw new Error('Invalid expiresAt property in UserEmailVerification');
      }
      // Check if expiresAt is after now (inclusive)
      if (user.expiresAt.getTime() <= now.getTime()) {
        throw new TRPCError({
          message: 'Email verification link has expired',
          code: 'BAD_REQUEST',
        });
      }
      if (input.token !== user.token) {
        throw new TRPCError({
          message: 'Email verification token is invalid',
          code: 'BAD_REQUEST',
        });
      }
      await ctx.db
        .updateTable('UserEmailVerification')
        .set({
          verifiedAt: new Date(),
          isVerified: true,
        })
        .executeTakeFirstOrThrow();
    }),
});
