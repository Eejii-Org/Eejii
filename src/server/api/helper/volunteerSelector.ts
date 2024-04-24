import type { DB } from '@/lib/db/types';
import type { Kysely } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export const selectVolunteerList = (db: Kysely<DB>) => {
  return db
    .selectFrom('User')
    .selectAll('User')
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('UserImage')
          .selectAll()
          .whereRef('User.id', '=', 'UserImage.ownerId')
      ).as('Images'),
    ]);
};

export const selectVolunteerDetail = (db: Kysely<DB>) => {
  return db
    .selectFrom('User')
    .selectAll('User')
    .select(eb => [
      jsonArrayFrom(
        eb
          .selectFrom('UserSkill')
          .selectAll('UserSkill')
          .select(eb1 => [
            jsonObjectFrom(
              eb1
                .selectFrom('Skill')
                .selectAll('Skill')
                .whereRef('Skill.id', '=', 'UserSkill.skillId')
            ).as('Skill'),
          ])
          .whereRef('User.id', '=', 'UserSkill.userId')
      ).as('UserSkills'),
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
    ]);
};

export const selectEventUserList = (db: Kysely<DB>) => {
  return db
    .selectFrom('EventParticipator')
    .selectAll('EventParticipator')
    .select(eb => [
      jsonObjectFrom(
        eb
          .selectFrom('Event')
          .selectAll()
          .whereRef('Event.id', '=', 'EventParticipator.eventId')
      ).as('Event'),
      jsonObjectFrom(
        eb
          .selectFrom('User')
          .selectAll()
          .select(eb1 => [
            jsonArrayFrom(
              eb1
                .selectFrom('UserImage')
                .selectAll()
                .whereRef('User.id', '=', 'UserImage.ownerId')
            ).as('Images'),
          ])
          .whereRef('User.id', '=', 'EventParticipator.userId')
      ).as('User'),
    ]);
};
