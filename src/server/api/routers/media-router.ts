import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { z } from 'zod';
import { createPresignedUrl } from '../helper/imageHelper';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import slugify from 'slugify';

export const mediaRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        ownerId: z.string().nullish(),
        category: z.string().nullish(),
        projectId: z.string().nullish(),
        limit: z.number().nullish(),
        page: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .selectFrom('Media')
        .selectAll('Media')
        .select(eb => [
          jsonArrayFrom(
            eb
              .selectFrom('MediaImage')
              .selectAll()
              .whereRef('Media.id', '=', 'MediaImage.ownerId')
          ).as('Images'),
          jsonArrayFrom(
            eb
              .selectFrom('CategoryMedia')
              .selectAll()
              .leftJoin('Category', join =>
                join.onRef('CategoryMedia.categoryId', '=', 'Category.id')
              )
              .whereRef('CategoryMedia.mediaId', '=', 'Media.id')
          ).as('Categories'),
          jsonObjectFrom(
            eb
              .selectFrom('User')
              .selectAll()
              .whereRef('Media.ownerId', '=', 'User.id')
          ).as('Owner'),
        ])
        .leftJoin('CategoryMedia', join =>
          join.onRef('CategoryMedia.mediaId', '=', 'Media.id')
        )
        .leftJoin('Category', join =>
          join.onRef('CategoryMedia.categoryId', '=', 'Category.id')
        );
      if (input.search) {
        query = query.where(eb =>
          eb.or([
            eb('Media.title', 'like', '%' + input.search + '%'),
            eb('Media.body', 'like', '%' + input.search + '%'),
            eb('Category.name', 'like', '%' + input.search + '%'),
          ])
        );
      }
      if (input.category) {
        query = query.where('CategoryMedia.id', '=', input.category);
      }
      if (input.ownerId) {
        query = query.where('Media.ownerId', '=', input.ownerId);
      }
      if (input.projectId) {
        query = query.where('Media.projectId', '=', input.projectId);
      }
      if (input.limit) {
        query = query.limit(input.limit);
      }
      if (input.page && input.limit) {
        const offset = (input.page - 1) * input.limit;
        query = query.offset(offset);
      }

      const res = await query
        .groupBy('Media.id')
        .orderBy('Media.createdAt desc')
        .execute();
      return res;
    }),
  findBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const media = await ctx.db
        .selectFrom('Media')
        .selectAll('Media')
        .select(eb => [
          jsonArrayFrom(
            eb
              .selectFrom('MediaImage')
              .selectAll()
              .whereRef('Media.id', '=', 'MediaImage.ownerId')
          ).as('Images'),
          jsonArrayFrom(
            eb
              .selectFrom('Category')
              .selectAll()
              .leftJoin('CategoryMedia', join =>
                join.onRef('CategoryMedia.mediaId', '=', 'Media.id')
              )
              .whereRef('CategoryMedia.categoryId', '=', 'Category.id')
          ).as('Categories'),
          jsonObjectFrom(
            eb
              .selectFrom('User')
              .selectAll()
              .whereRef('Media.ownerId', '=', 'User.id')
          ).as('Owner'),
        ])
        .where('Media.slug', '=', input.slug)
        .executeTakeFirstOrThrow();
      return media;
    }),
  createMedia: privateProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const mutation = await ctx.db.transaction().execute(async trx => {
        const media = await trx
          .insertInto('Media')
          .values({
            slug: slugify(input.title),
            title: input.title,
            body: input.body,
            ownerId: ctx.userId,
          })
          .returning(['id'])
          .executeTakeFirstOrThrow();
        if (input.categories.length > 0) {
          const inputArray = input.categories.map(category => {
            return {
              categoryId: category,
              mediaId: media.id,
            };
          });
          trx.insertInto('CategoryMedia').values(inputArray).execute();
        }
        return media.id;
      });

      return mutation;
    }),
  updateMedia: privateProcedure
    .input(
      z.object({
        mediaId: z.string(),
        title: z.string(),
        body: z.string(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const mutation = await ctx.db.transaction().execute(async trx => {
        const media = await trx
          .updateTable('Media')
          .set({
            title: input.title,
            body: input.body,
            ownerId: ctx.userId,
          })
          .returning(['id'])
          .executeTakeFirstOrThrow();

        if (input.categories.length > 0) {
          trx
            .deleteFrom('CategoryMedia')
            .where('CategoryMedia.mediaId', '=', media.id)
            .execute();

          const inputArray = input.categories.map(category => {
            return {
              categoryId: category,
              mediaId: media.id,
            };
          });
          trx.insertInto('CategoryMedia').values(inputArray).execute();
        }
        return media.id;
      });

      return mutation;
    }),
  createPresignedUrl: privateProcedure
    .input(
      z.object({
        mediaId: z.string(),
        name: z.string(),
        type: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.db
        .selectFrom('MediaImage')
        .select('id')
        .where('MediaImage.ownerId', '=', ctx.userId)
        .where('MediaImage.type', '=', input.type)
        .executeTakeFirst();

      if (exists) {
        ctx.db
          .deleteFrom('MediaImage')
          .where('MediaImage.id', '=', exists.id)
          .execute();
      }
      const mediaImage = await ctx.db
        .insertInto('MediaImage')
        .values({
          ownerId: input.mediaId,
          type: input.type,
          path: `uploads/media/${input.name}`,
        })
        .returning(['path'])
        .executeTakeFirstOrThrow();

      const res = await createPresignedUrl(mediaImage.path, input.contentType);

      return {
        data: res,
        fileName: input.name,
      };
    }),
  deleteImage: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .deleteFrom('MediaImage')
        .where('MediaImage.id', '=', input.id)
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
      const excludeMedia = await ctx.db
        .selectFrom('Media')
        .select(['Media.id', 'Media.ownerId'])
        .select(eb => [
          jsonArrayFrom(
            eb
              .selectFrom('CategoryMedia')
              .select(['CategoryMedia.id'])
              .whereRef('CategoryMedia.mediaId', '=', 'Media.id')
          ).as('Categories'),
        ])
        .where('id', '=', input.excludeId)
        .executeTakeFirst();
      let query = ctx.db
        .selectFrom('Media')
        .selectAll('Media')
        .select(eb => [
          jsonArrayFrom(
            eb
              .selectFrom('MediaImage')
              .selectAll()
              .whereRef('Media.id', '=', 'MediaImage.ownerId')
          ).as('Images'),
          jsonArrayFrom(
            eb
              .selectFrom('Category')
              .selectAll()
              .leftJoin('CategoryMedia', join =>
                join.onRef('CategoryMedia.mediaId', '=', 'Media.id')
              )
              .whereRef('CategoryMedia.categoryId', '=', 'Category.id')
          ).as('Categories'),
          jsonObjectFrom(
            eb
              .selectFrom('User')
              .selectAll()
              .whereRef('Media.ownerId', '=', 'User.id')
          ).as('Owner'),
        ])
        .leftJoin('CategoryMedia', join =>
          join.onRef('CategoryMedia.mediaId', '=', 'Media.id')
        )
        .leftJoin('Category', join =>
          join.onRef('CategoryMedia.categoryId', '=', 'Category.id')
        )
        .where('Media.id', '!=', excludeMedia?.id as string);

      if (excludeMedia && excludeMedia?.Categories?.length > 0) {
        query = query.where(eb =>
          eb.or(
            excludeMedia?.Categories?.map(c =>
              eb('CategoryMedia.id', '=', c.id)
            )
          )
        );
        query = query.where(eb =>
          eb.or([eb('Media.ownerId', '=', excludeMedia.ownerId)])
        );
      }
      if (input.limit) {
        query = query.limit(input.limit);
      }

      const res = await query.orderBy('Media.createdAt desc').execute();
      return res;
    }),
});
