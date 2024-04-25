import { z } from 'zod';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

export const dataRouter = createTRPCRouter({
  createCity: adminProcedure
    .input(
      z.object({
        name: z.string(),
        countryCode: z.string(),
        stateCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('City')
        .values({
          name: input.name,
          countryCode: input.countryCode,
          stateCode: input.stateCode,
        })
        .executeTakeFirstOrThrow();
    }),
  createState: adminProcedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        countryCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('State')
        .values({
          name: input.name,
          code: input.code,
          countryCode: input.countryCode,
        })
        .executeTakeFirstOrThrow();
    }),
  createCountry: adminProcedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        phoneCode: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insertInto('Country')
        .values({
          name: input.name,
          code: input.code,
          phoneCode: input.phoneCode,
        })
        .executeTakeFirstOrThrow();
    }),
  editCity: adminProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('City')
        .where('id', '=', input.id)
        .set({
          name: input.name,
        })
        .executeTakeFirstOrThrow();
    }),
  editState: adminProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('State')
        .where('id', '=', input.id)
        .set({
          name: input.name,
          code: input.code,
        })
        .executeTakeFirstOrThrow();
    }),
  editCountry: adminProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string(),
        phoneCode: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('Country')
        .where('id', '=', input.id)
        .set({
          name: input.name,
          code: input.code,
          phoneCode: input.phoneCode,
        })
        .executeTakeFirstOrThrow();
    }),
  deleteCity: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction().execute(async trx => {
        await trx
          .deleteFrom('City')
          .where('id', '=', input.id)
          // .where(eb =>
          //   eb.and({
          //     'City.stateCode': input.stateCode,
          //     'City.countryCode': input.countryCode,
          //   })
          // )
          .execute();
      });
    }),
  deleteState: adminProcedure
    .input(z.object({ stateCode: z.string(), countryCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction().execute(async trx => {
        await trx
          .deleteFrom('City')
          .where(eb =>
            eb.and({
              'City.stateCode': input.stateCode,
              'City.countryCode': input.countryCode,
            })
          )
          .execute();
        await trx
          .deleteFrom('State')
          .where(eb =>
            eb.and({
              code: input.stateCode,
              countryCode: input.countryCode,
            })
          )
          .execute();
      });
    }),
  deleteCountry: adminProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction().execute(async trx => {
        await trx
          .deleteFrom('City')
          .where('countryCode', '=', input.code)
          .execute();
        await trx
          .deleteFrom('State')
          .where('countryCode', '=', input.code)
          .execute();
        await trx
          .deleteFrom('Country')
          .where('code', '=', input.code)
          .execute();
      });
    }),
  getCountries: publicProcedure.query(async ({ ctx }) => {
    const countries = await ctx.db
      .selectFrom('Country')
      .selectAll('Country')
      .execute();
    return countries;
  }),
  findStatesByCountry: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ ctx, input }) => {
      const states = await ctx.db
        .selectFrom('State')
        .selectAll()
        .where('countryCode', '=', input.country)
        .execute();
      return states;
    }),
  findCitiesByCountryAndState: publicProcedure
    .input(z.object({ country: z.string(), state: z.string() }))
    .query(async ({ ctx, input }) => {
      const cities = await ctx.db
        .selectFrom('City')
        .selectAll()
        .where(eb =>
          eb.and({
            countryCode: input.country,
            stateCode: input.state,
          })
        )
        .execute();
      return cities;
    }),
  findCountryByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const country = await ctx.db
        .selectFrom('Country')
        .selectAll('Country')
        .where('code', '=', input.code)
        .executeTakeFirstOrThrow();
      return country;
    }),
  getHomeStatistics: publicProcedure.query(async ({ ctx }) => {
    const { count: totalUsers } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.requestStatus': 'REQUEST_APPROVED',
        })
      )
      .executeTakeFirstOrThrow();

    const { count: totalVolunteers } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.type': 'USER_VOLUNTEER',
          'User.requestStatus': 'REQUEST_APPROVED',
        })
      )
      .executeTakeFirstOrThrow();

    const { count: level1 } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.type': 'USER_VOLUNTEER',
          'User.requestStatus': 'REQUEST_APPROVED',
          'User.level': 1,
        })
      )
      .executeTakeFirstOrThrow();
    const { count: level2 } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.type': 'USER_VOLUNTEER',
          'User.requestStatus': 'REQUEST_APPROVED',
          'User.level': 2,
        })
      )
      .executeTakeFirstOrThrow();
    const { count: level3 } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.type': 'USER_VOLUNTEER',
          'User.requestStatus': 'REQUEST_APPROVED',
          'User.level': 3,
        })
      )
      .executeTakeFirstOrThrow();
    const { count: level4 } = await ctx.db
      .selectFrom('User')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb.and({
          'User.type': 'USER_VOLUNTEER',
          'User.requestStatus': 'REQUEST_APPROVED',
          'User.level': 4,
        })
      )
      .executeTakeFirstOrThrow();

    const volunteersPercentage =
      ((totalUsers as number) * (totalVolunteers as number)) / 100;

    const { count: totalVolunteeringEvents } = await ctx.db
      .selectFrom('Event')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where('Event.type', '=', 'VOLUNTEERING')
      .where(eb =>
        eb('Event.status', '=', 'APPROVED').or('Event.status', '=', 'DONE')
      )
      .executeTakeFirstOrThrow();

    const { count: totalProjects } = await ctx.db
      .selectFrom('Project')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where(eb =>
        eb('Project.status', '=', 'APPROVED').or('Project.status', '=', 'DONE')
      )
      .executeTakeFirstOrThrow();

    const { amount: totalDonation } = await ctx.db
      .selectFrom('Donation')
      .select(eb => eb.fn.sum('amount').as('amount'))
      .executeTakeFirstOrThrow();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are 0-indexed, so add 1

    const { count: thisMonthEvents } = await ctx.db
      .selectFrom('Event')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where('createdAt', '>=', new Date(year, month - 1, 1))
      .where('createdAt', '<', new Date(year, month, 1))
      .executeTakeFirstOrThrow();
    const { count: thisMonthProjects } = await ctx.db
      .selectFrom('Project')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where('createdAt', '>=', new Date(year, month - 1, 1))
      .where('createdAt', '<', new Date(year, month, 1))
      .executeTakeFirstOrThrow();

    const countries = await ctx.db
      .selectFrom('Country')
      .selectAll()
      .where('volunteers', '>', 0)
      .execute();

    return {
      totalVolunteers: +(totalVolunteers as number),
      volunteersPercentage: +(volunteersPercentage as number),
      totalVolunteeringEvents: +(totalVolunteeringEvents as number),
      totalProjects: +(totalProjects as number),
      totalDonation: +(totalDonation as number),
      level_1: +(level1 as number),
      level_2: +(level2 as number),
      level_3: +(level3 as number),
      level_4: +(level4 as number),
      thisMonthProjectsAndEvents:
        +(thisMonthProjects as number) + +(thisMonthEvents as number),
      countries,
    };
  }),
});
