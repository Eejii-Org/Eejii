import { z } from 'zod';

import { categorySchema } from '@/lib/validation/category.schema';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import slugify from 'slugify';

export const categoryRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ type: z.string().nullish(), name: z.string().nullish() }))
    .query(async opts => {
      const query = opts.ctx.db.selectFrom('Category').selectAll();

      if (opts.input.type) {
        query.where('Category.type', '=', opts.input.type);
      }
      if (opts.input.name) {
        query.where('Category.name', '=', opts.input.name);
      }

      const category = await query.execute();
      return category;
    }),
  getMediaCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db
      .selectFrom('CategoryMedia')
      .selectAll('CategoryMedia')
      .select(eb => [
        jsonObjectFrom(
          eb
            .selectFrom('Category')
            .selectAll()
            .whereRef('Category.id', '=', 'CategoryMedia.categoryId')
        ).as('Category'),
      ])
      .execute();

    return categories;
  }),
  create: privateProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('Category')
        .values({
          name: input.name,
          code: slugify(input.type + '_' + input.name),
          type: input.type,
        })
        .executeTakeFirstOrThrow();
    }),
});
