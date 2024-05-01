import { PartnerType } from '@/lib/db/enums';
import type { User } from '@/lib/db/types';
import type { RequestStatus, ListResponse, Pagination } from '@/lib/types';
import { bioSchema } from '@/lib/validation/mutation-schema/partner/bio-schema';
import { partnerSchema } from '@/lib/validation/partner-validation-schema';
import { findAllQuerySchema } from '@/lib/validation/query-schema/partnerRepositorySchema';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { z } from 'zod';
import { createPresignedUrl } from '../helper/imageHelper';
import { getPaginationInfo } from '../helper/paginationInfo';
import {
  selectPartnerDetail,
  selectPartnerList,
} from '../helper/partnerSelector';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';

export const partnerRouter = createTRPCRouter({
  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = selectPartnerDetail(ctx.db)
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();
      return query;
    }),
  findAll: publicProcedure
    .input(findAllQuerySchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.transaction().execute(async trx => {
        const partners = await selectPartnerList(trx)
          .where('User.type', '=', 'USER_PARTNER')
          .$if(input.status !== undefined, qb =>
            qb.where('User.requestStatus', '=', input.status as RequestStatus)
          )
          .$if(input.search !== undefined, qb =>
            qb.where(eb =>
              eb.or([
                eb('User.email', 'like', '%' + input.search + '%'),
                eb('User.phoneNumber', 'like', '%' + input.search + '%'),
                eb('User.organizationName', 'like', '%' + input.search + '%'),
                eb('User.firstName', 'like', '%' + input.search + '%'),
                eb('User.lastName', 'like', '%' + input.search + '%'),
              ])
            )
          )
          .$if(input.partnerType !== undefined, qb =>
            qb
              .leftJoin('Subscription', join =>
                join.onRef('User.subscriptionId', '=', 'Subscription.id')
              )
              .where('Subscription.code', '=', input.partnerType as PartnerType)
          )
          .limit(input.limit)
          .offset(input.limit * (input.page - 1))
          .groupBy('User.id')
          .orderBy('User.createdAt desc')
          .execute();

        const { count } = await trx
          .selectFrom('User')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .leftJoin('Subscription', join =>
            join.onRef('User.subscriptionId', '=', 'Subscription.id')
          )
          .where('User.type', '=', 'USER_PARTNER')

          .$if(input.status !== undefined, qb =>
            qb.where('User.requestStatus', '=', input.status as RequestStatus)
          )
          .$if(input.search !== undefined, qb =>
            qb.where(eb =>
              eb.or([
                eb('User.email', 'like', '%' + input.search + '%'),
                eb('User.phoneNumber', 'like', '%' + input.search + '%'),
                eb('User.organizationName', 'like', '%' + input.search + '%'),
                eb('User.firstName', 'like', '%' + input.search + '%'),
                eb('User.lastName', 'like', '%' + input.search + '%'),
              ])
            )
          )
          .$if(input.partnerType !== undefined, qb =>
            qb
              .leftJoin('Subscription', join =>
                join.onRef('User.subscriptionId', '=', 'Subscription.id')
              )
              .where('Subscription.code', '=', input.partnerType as PartnerType)
          )
          .executeTakeFirstOrThrow();

        return {
          data: partners,
          count,
        };
      });

      const paginationInfo: Pagination = getPaginationInfo({
        totalCount: result.count as number,
        limit: input.limit,
        page: input.page,
      });
      const response: ListResponse<User> = {
        items: result.data as unknown as User[],
        pagination: paginationInfo,
      };
      return response;
    }),
  register: publicProcedure
    .input(partnerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const emailVerification = await ctx.db
        .selectFrom('UserEmailVerification')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirst();
      if (!emailVerification || !emailVerification?.isVerified) {
        throw new TRPCError({
          message: 'Email is not verified, please verify your email',
          code: 'BAD_REQUEST',
        });
      }

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
        const subscription = await trx
          .selectFrom('Subscription')
          .select('id')
          .where('code', '=', PartnerType.BASIC)
          .executeTakeFirstOrThrow();

        const hashedPassword = await hash(password);
        const partner = await trx
          .insertInto('User')
          .values({
            organizationName: input.organizationName,
            organizationType: input.organizationType,
            phoneNumber: input.contact.phoneNumber1,
            bio: input.bio,
            introduction: input.introduction,
            email: input.email,
            type: 'USER_PARTNER',
            subscriptionId: subscription.id,
            contact: {
              phone_primary: input.contact.phoneNumber1,
              phone_secondary: input.contact.phoneNumber2,
            },
            password: hashedPassword,
          })
          .returning(['id', 'password', 'email', 'type'])
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
            userId: partner.id,
          })
          .execute();

        trx
          .insertInto('Notification')
          .values({
            title: partner.email + ' wants to join Eejii.org',
            link: '/admin/users',
            receiverId: partner.id,
            senderId: partner.id,
            status: 'new',
            type: 'request',
          })
          .execute();

        return partner;
      });

      return {
        status: 201,
        message: 'Account created successfully',
        result: mutation,
      };
    }),
  updateBio: privateProcedure
    .input(bioSchema)
    .mutation(async ({ input, ctx }) => {
      console.log('IN UPDATE BIO');
      const res = await ctx.db.transaction().execute(async trx => {
        const user = await trx
          .updateTable('User')
          .where('User.id', '=', ctx.userId)
          .set({
            organizationName: input.organizationName,
            bio: input.bio,
          })
          .returning(['User.id'])
          .executeTakeFirstOrThrow();
        const country = await trx
          .selectFrom('Country')
          .selectAll('Country')
          .where('code', '=', input.address.countryCode)
          .executeTakeFirstOrThrow();
        if (input.addressId) {
          trx
            .updateTable('Address')
            .where('id', '=', input.addressId)
            .set({
              provinceName: input.address.provinceName ?? '',
              country: country?.name ?? input.address.countryCode ?? '',
              countryCode: input.address.countryCode ?? '',
              city: input.address.city ?? '',
              district: input.address.district ?? '',
              street: input.address.street ?? '',
              userId: user.id,
            })
            .execute();
        } else {
          trx
            .insertInto('Address')
            .values({
              provinceName: input.address.provinceName ?? '',
              country: country?.name ?? input.address.countryCode ?? '',
              countryCode: input.address.countryCode ?? '',
              city: input.address.city ?? '',
              district: input.address.district ?? '',
              street: input.address.street ?? '',
              userId: user.id,
            })
            .execute();
        }
        return user;
      });
      return res;
    }),
  updateContact: privateProcedure
    .input(
      z.object({
        contact: z.object({
          phone: z.string().nullish(),
          email: z.string().nullish(),
          facebookUrl: z.string().nullish(),
          instagramUrl: z.string().nullish(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .updateTable('User')
        .where('User.id', '=', ctx.userId)
        .set({
          contact: input.contact,
        })
        .execute();
    }),
  createPresignedUrl: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        type: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.db
        .selectFrom('UserImage')
        .select('id')
        .where('UserImage.ownerId', '=', ctx.userId)
        .where('UserImage.type', '=', input.type)
        .executeTakeFirst();

      if (exists) {
        ctx.db
          .deleteFrom('UserImage')
          .where('UserImage.id', '=', exists.id)
          .execute();
      }
      const userImage = await ctx.db
        .insertInto('UserImage')
        .values({
          ownerId: input.userId,
          type: input.type,
          path: `uploads/user/${input.name}`,
        })
        .returning(['path'])
        .executeTakeFirstOrThrow();

      const res = await createPresignedUrl(userImage.path, input.contentType);

      return {
        data: res,
        fileName: input.name,
      };
    }),
});
