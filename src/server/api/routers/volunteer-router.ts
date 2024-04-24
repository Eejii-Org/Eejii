import { z } from 'zod';

import { volunteerSchema } from '@/lib/validation/mutation-schema/volunteer/volunteer-schema';
import type { User } from '@/lib/db/types';
import type { ListResponse, Pagination } from '@/lib/types';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { getPaginationInfo } from '../helper/paginationInfo';

import { Role, RequestStatus } from '@/lib/db/enums';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { updateInfoSchema } from '@/lib/validation/mutation-schema/volunteer/updateInfo-schema';
import { findAllQuerySchema } from '@/lib/validation/query-schema/volunteerRepositorySchema';
import { selectVolunteerDetail } from '../helper/volunteerSelector';
import { volunteerRepository } from '../repository/volunteer-repository';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export const volunteerRouter = createTRPCRouter({
  getSkills: publicProcedure.query(async ({ ctx }) => {
    const skills = await ctx.db.selectFrom('Skill').selectAll().execute();
    return skills;
  }),
  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const volunteer = await selectVolunteerDetail(ctx.db)
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();

      return volunteer;
    }),
  register: publicProcedure
    .input(volunteerSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      const mutation = await ctx.db.transaction().execute(async trx => {
        const exists = await trx
          .selectFrom('User')
          .where('email', '=', email)
          .selectAll()
          .executeTakeFirst();

        if (exists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists.',
          });
        }

        const hashedPassword = await hash(password);

        const user = await trx
          .insertInto('User')
          .values({
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
            email: input.email,
            gender: input.gender,
            birthDate: input.birthDate,
            registerCode: input.registerCode,
            level: 1,
            xp: 0,
            bio: input.bio,
            password: hashedPassword,
            role: Role.ROLE_USER,
            requestStatus: RequestStatus.REQUEST_PENDING,
          })
          .returning(['email', 'password', 'type', 'id'])
          .executeTakeFirstOrThrow();

        const country = await trx
          .selectFrom('Country')
          .selectAll('Country')
          .where('code', '=', input.address.countryCode)
          .executeTakeFirstOrThrow();

        trx
          .insertInto('Address')
          .values({
            provinceName: input.address.provinceName,
            country: country?.name ?? input.address.countryCode,
            countryCode: input.address.countryCode,
            city: input.address.city,
            district: input.address.district,
            street: input.address.street,
            userId: user.id,
          })
          .execute();

        trx
          .updateTable('Country')
          .where('code', '=', input.address.countryCode)
          .set(eb => ({
            volunteers: eb('volunteers', '+', 1),
          }))
          .execute();

        trx
          .insertInto('Notification')
          .values({
            title: user.email + ' wants to join Eejii.org',
            link: '/admin/users',
            receiverId: user.id,
            senderId: user.id,
            status: 'new',
            type: 'request',
          })
          .execute();
        return user;
      });

      return {
        status: 201,
        message: 'Account created successfully',
        result: mutation,
      };
    }),
  findAll: publicProcedure
    .input(findAllQuerySchema)
    .query(async ({ ctx, input }) => {
      const result = await volunteerRepository.findAll(ctx.db, input);
      const totalCount = result.count as number;
      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: totalCount,
        limit: input.limit,
        page: input.page,
      });
      const response: ListResponse<User> = {
        items: result.data as unknown as User[],
        pagination: paginationInfo,
      };
      return response;
    }),
  updateInfo: privateProcedure
    .input(updateInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const volunteer = await ctx.db
        .updateTable('User')
        .set({
          lastName: input.lastName ?? '',
          firstName: input.firstName ?? '',
          email: input.email ?? '',
          birthDate: input.birthDate ?? '',
          gender: input.gender ?? '',
        })
        .where('User.id', '=', input.userId)
        .returning('id')
        .executeTakeFirstOrThrow();
      return volunteer;
    }),
  updateBio: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        bio: z.string(),
        skills: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .updateTable('User')
        .where('User.id', '=', input.userId)
        .set({ bio: input.bio })
        .returning('id')
        .executeTakeFirstOrThrow();

      const existsArr = await ctx.db
        .selectFrom('UserSkill')
        .select('id')
        .where('UserSkill.userId', '=', user.id)
        .execute();

      existsArr?.forEach(exist => {
        const match = input.skills.find(e => e === exist.id);
        if (!match) {
          ctx.db
            .deleteFrom('UserSkill')
            .where('UserSkill.skillId', '=', exist.id)
            .where('UserSkill.userId', '=', user.id)
            .execute();
        }
      });
      input.skills.forEach(skillId => {
        const isExists = existsArr.find(s => s.id === skillId);
        console.log(isExists);
        if (!isExists) {
          ctx.db
            .insertInto('UserSkill')
            .values({ userId: user.id, skillId: skillId })
            .execute();
        }
      });
    }),
  getMyCertificates: privateProcedure.query(async ({ ctx }) => {
    const certs = await ctx.db
      .selectFrom('Certificate')
      .selectAll()
      .select(eb => [
        jsonObjectFrom(
          eb
            .selectFrom('CertificateTemplate')
            .selectAll()
            .whereRef(
              'Certificate.certificateTemplateId',
              '=',
              'CertificateTemplate.id'
            )
        ).as('Template'),
      ])
      .select(eb => [
        jsonObjectFrom(
          eb
            .selectFrom('Event')
            .selectAll()
            .whereRef('Event.id', '=', 'Certificate.eventId')
        ).as('Event'),
      ])
      .where('volunteerId', '=', ctx.userId)
      .execute();
    return certs;
  }),
});
