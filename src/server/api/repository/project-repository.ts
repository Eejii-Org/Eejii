import type { DB } from '@/lib/db/types';
import type {
  findAllQuerySchema,
  getMyProjectsQuerySchema,
} from '@/lib/validation/query-schema/projectRepositorySchema';
import type { Kysely } from 'kysely';
import type { z } from 'zod';
import { selectProjectList } from '../helper/projectSelector';
import type { ProjectType } from '@/lib/db/enums';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

export const projectRepository = {
  findAll: async (
    db: Kysely<DB>,
    input: z.infer<typeof findAllQuerySchema>
  ) => {
    let query = selectProjectList(db).where('Project.type', '=', input.type);
    if (input.title) {
      query = query.where('title', 'like', '%' + input.title + '%');
    }
    if (input.enabled) {
      query = query.where('enabled', '=', input.enabled);
    }
    if (input.featured) {
      query = query.where('featured', '=', input.featured);
    }
    if (input.status) {
      query = query.where('status', '=', input.status);
    }
    if (input.partnerId) {
      query = query.where('ownerId', '=', input.partnerId);
    }
    const queryResult = await query
      .limit(input.limit)
      .offset(input.limit * (input.page - 1))
      .orderBy('Project.createdAt', input.sort)
      .execute();

    let paginationQuery = db
      .selectFrom('Project')
      .select(expressionBuilder => {
        return expressionBuilder.fn.countAll().as('count');
      })
      .where('Project.type', '=', input.type as ProjectType);
    if (input.title) {
      paginationQuery = paginationQuery.where(
        'title',
        'like',
        '%' + input.title + '%'
      );
    }
    if (input.enabled) {
      paginationQuery = paginationQuery.where('enabled', '=', input.enabled);
    }
    if (input.status) {
      paginationQuery = paginationQuery.where('status', '=', input.status);
    }
    if (input.partnerId) {
      paginationQuery = paginationQuery.where('ownerId', '=', input.partnerId);
    }
    const { count } = await paginationQuery.executeTakeFirstOrThrow();
    return {
      data: queryResult,
      count,
    };
  },
  getMyProjects: async (
    db: Kysely<DB>,
    input: z.infer<typeof getMyProjectsQuerySchema>,
    userId: string
  ) => {
    let query = selectProjectList(db).where(eb =>
      eb.and({
        ownerId: userId,
        type: input.type,
      })
    );

    if (input.name) {
      query = query.where('Project.title', 'like', '%' + input.name + '%');
    }
    if (input.status) {
      query = query.where('Project.status', '=', input.status);
    }

    const projects = await query.execute();
    return projects;
  },
  findRelated: async (
    db: Kysely<DB>,
    input: { excludeId: string; limit?: number | undefined | null }
  ) => {
    const excludeProject = await db
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
    let query = selectProjectList(db)
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
  },
};
