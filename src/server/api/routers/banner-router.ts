import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { createPresignedUrl, deleteImage } from '../helper/imageHelper';
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '../trpc';

export const bannerRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(
      z.object({
        positionCode: z.string().nullish(),
        search: z.string().nullish(),
        limit: z.number().nullish(),
        page: z.number().default(1).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.db.transaction().execute(async trx => {
        let query = trx
          .selectFrom('Banner')
          .selectAll('Banner')
          .select(eb => [
            jsonObjectFrom(
              eb
                .selectFrom('BannerPosition')
                .selectAll()
                .whereRef('BannerPosition.id', '=', 'Banner.bannerPositionId')
            ).as('Position'),
          ])
          .leftJoin('BannerPosition', join =>
            join.onRef('BannerPosition.id', '=', 'Banner.bannerPositionId')
          );

        if (input.positionCode) {
          query = query.where('BannerPosition.code', '=', input.positionCode);
        }
        if (input.search) {
          query = query.where(eb =>
            eb.or([
              eb('Banner.title', 'like', '%' + input.search + '%'),
              eb('Banner.description', 'like', '%' + input.search + '%'),
            ])
          );
        }
        const banners = await query
          .limit(input.limit ?? 20)
          .offset((input.limit ?? 20) * ((input.page ?? 1) - 1))
          .execute();

        let countQuery = trx
          .selectFrom('Banner')
          .select(expressionBuilder => {
            return expressionBuilder.fn.countAll().as('count');
          })
          .leftJoin('BannerPosition', join =>
            join.onRef('BannerPosition.id', '=', 'Banner.bannerPositionId')
          );

        if (input.positionCode) {
          countQuery = countQuery.where(
            'BannerPosition.code',
            '=',
            input.positionCode
          );
        }
        if (input.search) {
          countQuery = countQuery.where(eb =>
            eb.or([
              eb('Banner.title', 'like', '%' + input.search + '%'),
              eb('Banner.description', 'like', '%' + input.search + '%'),
            ])
          );
        }
        const { count } = await countQuery.executeTakeFirstOrThrow();

        return {
          banners,
          total: count,
        };
      });

      return result;
    }),
  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const banner = await ctx.db
        .selectFrom('Banner')
        .selectAll('Banner')
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();
      return banner;
    }),
  deleteImage: adminProcedure
    .input(z.object({ id: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db
        .selectFrom('Banner')
        .select(['path', 'id', 'mobilePath'])
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow();
      if (input.type === 'desktop') {
        deleteImage(exists.path as string)
          .then(async () => {
            await ctx.db
              .updateTable('Banner')
              .where('id', '=', input.id)
              .set({ path: null })
              .execute();
          })
          .catch(err => {
            throw new TRPCError({
              message: err.message,
              code: 'INTERNAL_SERVER_ERROR',
            });
          });
      } else {
        deleteImage(exists.mobilePath as string)
          .then(async () => {
            await ctx.db
              .updateTable('Banner')
              .where('id', '=', input.id)
              .set({ mobilePath: null })
              .execute();
          })
          .catch(err => {
            throw new TRPCError({
              message: err.message,
              code: 'INTERNAL_SERVER_ERROR',
            });
          });
      }
      return exists;
    }),
  getBannerPositions: publicProcedure.query(async ({ ctx }) => {
    const positions = await ctx.db
      .selectFrom('BannerPosition')
      .selectAll('BannerPosition')
      .execute();

    return positions;
  }),
  createPosition: privateProcedure
    .input(z.object({ code: z.string(), label: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('BannerPosition')
        .values({
          code: input.code,
          label: input.label,
        })
        .executeTakeFirstOrThrow();
    }),
  updateBanner: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().nullable().nullish().default(null),
        description: z.string().nullable().nullish().default(null),
        link: z.string().nullable().nullish().default(null),
        positionCode: z.string().nullish(),
        contentTypeMobile: z.string().nullish(),
        contentType: z.string().nullish(),
        nameMobile: z.string().nullish(),
        name: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let mutate = ctx.db
        .updateTable('Banner')
        .where('Banner.id', '=', input.id)
        .set({
          title: input.title,
          description: input.description,
          link: input.link,
          bannerPositionId: input.positionCode,
        });
      if (input.name && input.contentType) {
        mutate = mutate.set({
          path: `uploads/banner/${input.name}`,
        });
      }
      if (input.nameMobile && input.contentTypeMobile) {
        mutate = mutate.set({
          mobilePath: `uploads/banner-m/${input.nameMobile}`,
        });
      }
      const banner = await mutate
        .returning(['path', 'mobilePath'])
        .executeTakeFirstOrThrow();

      let resMobile = null;
      if (input.nameMobile && input.contentTypeMobile) {
        resMobile = await createPresignedUrl(
          banner?.mobilePath as string,
          input.contentTypeMobile
        );
      }
      let res = null;
      if (input.name && input.contentType) {
        res = await createPresignedUrl(
          banner?.path as string,
          input.contentType
        );
      }
      return {
        data: res,
        dataMobile: resMobile,
        fileName: input.name,
        fileNameMobile: input.nameMobile,
      };
    }),
  createBanner: privateProcedure
    .input(
      z.object({
        title: z.string().nullable().nullish().default(null),
        description: z.string().nullable().nullish().default(null),
        link: z.string().nullable().nullish().default(null),
        positionCode: z.string(),
        contentTypeMobile: z.string(),
        contentType: z.string(),
        nameMobile: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const banner = await ctx.db.transaction().execute(async trx => {
        const bannerMutation = await trx
          .insertInto('Banner')
          .values({
            title: input.title,
            description: input.description,
            link: input.link,
            bannerPositionId: input.positionCode,
          })
          .returning('id')
          .executeTakeFirstOrThrow();
        let mutate = trx
          .updateTable('Banner')
          .where('id', '=', bannerMutation.id);
        if (input.name && input.contentType) {
          mutate = mutate.set({
            path: `uploads/banner/${input.name}`,
          });
        }
        if (input.nameMobile && input.contentTypeMobile) {
          mutate = mutate.set({
            mobilePath: `uploads/banner-m/${input.nameMobile}`,
          });
        }
        const res = await mutate
          .returning(['path', 'id', 'mobilePath'])
          .executeTakeFirstOrThrow();
        return res;
      });

      let resMobile = null;
      if (input.nameMobile && input.contentTypeMobile) {
        resMobile = await createPresignedUrl(
          banner?.mobilePath as string,
          input.contentTypeMobile
        );
      }
      let res = null;
      if (input.name && input.contentType) {
        res = await createPresignedUrl(
          banner?.path as string,
          input.contentType
        );
      }
      return {
        data: res,
        dataMobile: resMobile,
        fileName: input.name,
        fileNameMobile: input.nameMobile,
      };
    }),
  deleteBanner: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const exists = await ctx.db
          .selectFrom('Banner')
          .selectAll()
          .where('Banner.id', '=', input.id)
          .executeTakeFirstOrThrow();

        await deleteImage(exists?.path as string);
        await deleteImage(exists?.mobilePath as string);

        await ctx.db
          .deleteFrom('Banner')
          .where('Banner.id', '=', input.id)
          .execute();
      } catch (err: any) {
        throw new TRPCError({
          message: err?.message,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
