import type { DB } from '@/lib/db/types';
import type { Kysely, Transaction } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export const selectEventDetail = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('Event')
    .selectAll('Event')
    .select(eb1 => [
      jsonArrayFrom(
        eb1
          .selectFrom('EventCollaborator')
          .selectAll('EventCollaborator')
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
                .whereRef('User.id', '=', 'EventCollaborator.userId')
            ).as('User'),
          ])
          .whereRef('EventCollaborator.eventId', '=', 'Event.id')
          .where('EventCollaborator.status', '=', 'REQUEST_APPROVED')
      ).as('Collaborators'),
      jsonArrayFrom(
        eb1
          .selectFrom('Category')
          .selectAll()
          .leftJoin('CategoryEvent', join =>
            join.onRef('CategoryEvent.eventId', '=', 'Event.id')
          )
          .whereRef('CategoryEvent.categoryId', '=', 'Category.id')
      ).as('Categories'),
      jsonArrayFrom(
        eb1
          .selectFrom('EventImage')
          .selectAll()
          .whereRef('Event.id', '=', 'EventImage.ownerId')
      ).as('Images'),
      jsonArrayFrom(
        eb1
          .selectFrom('EventRole')
          .selectAll()
          .whereRef('EventRole.eventId', '=', 'Event.id')
      ).as('Roles'),
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
                .selectAll()
                .whereRef('User.id', '=', 'UserImage.ownerId')
            ).as('Images'),
          ])
          .whereRef('User.id', '=', 'Event.ownerId')
      ).as('Owner'),
    ]);
};

export const selectEventList = (db: Transaction<DB> | Kysely<DB>) => {
  return db
    .selectFrom('Event')
    .selectAll('Event')
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('Category')
          .selectAll()
          .leftJoin('CategoryEvent', join =>
            join.onRef('CategoryEvent.eventId', '=', 'Event.id')
          )
          .whereRef('CategoryEvent.categoryId', '=', 'Category.id')
      ).as('Categories'),
      jsonArrayFrom(
        eb
          .selectFrom('EventImage')
          .selectAll()
          .whereRef('Event.id', '=', 'EventImage.ownerId')
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
          .whereRef('User.id', '=', 'Event.ownerId')
      ).as('Owner'),
    ]);
};
