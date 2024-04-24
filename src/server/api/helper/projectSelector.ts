import type { DB } from '@/lib/db/types';
import type { Kysely, Transaction } from 'kysely';

import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export const selectProjectDetail = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('Project')
    .selectAll('Project')
    .select(eb1 => [
      jsonArrayFrom(
        eb1
          .selectFrom('ProjectCollaborator')
          .selectAll('ProjectCollaborator')
          .select(eb3 => [
            jsonObjectFrom(
              eb3
                .selectFrom('User')
                .selectAll('User')
                .select(eb4 => [
                  jsonArrayFrom(
                    eb4
                      .selectFrom('UserImage')
                      .whereRef('User.id', '=', 'UserImage.ownerId')
                  ).as('Images'),
                ])
                .whereRef('User.id', '=', 'ProjectCollaborator.userId')
            ).as('User'),
          ])
          .whereRef('ProjectCollaborator.projectId', '=', 'Project.id')
          .where('ProjectCollaborator.status', '=', 'REQUEST_APPROVED')
      ).as('Collaborators'),
      jsonArrayFrom(
        eb1
          .selectFrom('Category')
          .selectAll()
          .leftJoin('CategoryProject', join =>
            join.onRef('CategoryProject.projectId', '=', 'Project.id')
          )
          .whereRef('CategoryProject.categoryId', '=', 'Category.id')
      ).as('Categories'),
      jsonArrayFrom(
        eb1
          .selectFrom('ProjectImage')
          .selectAll()
          .whereRef('Project.id', '=', 'ProjectImage.ownerId')
      ).as('Images'),
      jsonArrayFrom(
        eb1
          .selectFrom('Donation')
          .selectAll('Donation')
          .whereRef('Donation.projectId', '=', 'Project.id')
      ).as('Donations'),
    ])
    .select(eb => [
      jsonObjectFrom(
        eb
          .selectFrom('User')
          .selectAll('User')
          .select(eb5 => [
            jsonArrayFrom(
              eb5
                .selectFrom('UserImage')
                .whereRef('User.id', '=', 'UserImage.ownerId')
            ).as('Images'),
          ])
          .whereRef('User.id', '=', 'Project.ownerId')
      ).as('Owner'),
    ]);
};

export const selectProjectList = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('Project')
    .selectAll('Project')
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('Category')
          .selectAll()
          .leftJoin('CategoryProject', join =>
            join.onRef('CategoryProject.projectId', '=', 'Project.id')
          )
          .whereRef('CategoryProject.categoryId', '=', 'Category.id')
      ).as('Categories'),
      jsonArrayFrom(
        eb
          .selectFrom('ProjectImage')
          .selectAll()
          .whereRef('Project.id', '=', 'ProjectImage.ownerId')
      ).as('Images'),
    ])
    .select(eb1 => [
      jsonObjectFrom(
        eb1
          .selectFrom('User')
          .selectAll()
          .select(eb2 => [
            jsonArrayFrom(
              eb2
                .selectFrom('UserImage')
                .whereRef('User.id', '=', 'UserImage.ownerId')
            ).as('Images'),
          ])
          .whereRef('User.id', '=', 'Project.ownerId')
      ).as('Owner'),
    ]);
};
