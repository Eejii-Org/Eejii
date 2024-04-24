import { db } from '../src/server/db';
import slugify from 'slugify';
// import worldData from '../src/lib/countries+states+cities.json';
import {
  Role,
  UserType,
  ProjectType,
  EventType,
  ProjectStatus,
  RequestStatus,
} from '../src/lib/db/enums';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';

// interface Timezone {
//   zoneName: string;
//   gmtOffset: number;
//   gmtOffsetName: string;
//   abbreviation: string;
//   tzName: string;
// }

// interface City {
//   id: number;
//   name: string;
//   latitude: string;
//   longitude: string;
// }

// interface State {
//   id: number;
//   name: string;
//   state_code: string;
//   latitude: string;
//   longitude: string;
//   type: any; // Adjust the type as needed
//   cities: City[];
// }

// interface Translation {
//   [key: string]: string;
// }

// interface Country {
//   id: number;
//   name: string;
//   iso3: string;
//   iso2: string;
//   numeric_code: string;
//   phone_code: string;
//   capital: string;
//   currency: string;
//   currency_name: string;
//   currency_symbol: string;
//   tld: string;
//   native: string;
//   region: string;
//   region_id: string;
//   subregion: string;
//   subregion_id: string;
//   nationality: string;
//   timezones: Timezone[];
//   translations: Translation;
//   latitude: string;
//   longitude: string;
//   emoji: string;
//   emojiU: string;
//   states: State[];
// }

async function clearData() {
  try {
    db.deleteFrom('CategoryMedia').execute();
    db.deleteFrom('CategoryEvent').execute();
    db.deleteFrom('CategoryProject').execute();
    db.deleteFrom('Notification').execute();
    db.deleteFrom('Donation').execute();
    db.deleteFrom('Category').execute();
    db.deleteFrom('Project').execute();
    db.deleteFrom('Event').execute();
    db.deleteFrom('Media').execute();
    db.deleteFrom('User').execute();

    console.log('Data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// async function seedWorldCountries() {
//   const countries = worldData as Country[];
//   countries.forEach(async country => {
//     db.insertInto('Country')
//       .values({
//         code: country.iso2,
//         name: country.name,
//         phoneCode: country.phone_code,
//         region: country.region,
//       })
//       .execute();
//     country.states.forEach(state => {
//       db.insertInto('State')
//         .values({
//           countryCode: country.iso2,
//           code: state.state_code,
//           name: state.name,
//         })
//         .execute();
//       state.cities.forEach(city => {
//         db.insertInto('City')
//           .values({
//             countryCode: country.iso2,
//             stateCode: state.state_code,
//             name: city.name,
//           })
//           .execute();
//       });
//     });
//   });
// }

async function createCategories(count: number) {
  for (let i = 0; i < count; i++) {
    await db
      .insertInto('Category')
      .values({
        code: faker.string.uuid(),
        name: faker.lorem.word(),
        type: faker.helpers.arrayElement(['event', 'project', 'media']),
      })
      .execute();
  }
  console.log('Created ' + count + ' category');
}

async function createSkills(count: number) {
  for (let i = 0; i < count; i++) {
    await db
      .insertInto('Skill')
      .values({
        name: faker.lorem.word(),
      })
      .execute();
  }
  console.log('Created ' + count + ' skill');
}

async function createMedia(count: number) {
  const user = await db
    .selectFrom('User')
    .select('id')
    .where('type', '=', 'USER_PARTNER')
    .execute();
  const userIds = user ? user.map(u => u.id) : [];

  const categories = await db
    .selectFrom('Category')
    .select('id')
    .where('type', '=', 'event')
    .execute();
  const categoryIds = categories ? categories.map(c => c.id) : [];

  for (let i = 0; i < count; i++) {
    await db.transaction().execute(async trx => {
      const media = await trx
        .insertInto('Media')
        .values({
          slug: slugify(faker.lorem.words(5)),
          title: faker.lorem.words(5),
          body: faker.lorem.sentences(8),
          ownerId: faker.helpers.arrayElement(userIds),
        })
        .returning('id')
        .executeTakeFirstOrThrow();
      if (categoryIds.length > 0) {
        categoryIds.map(c => {
          trx
            .insertInto('CategoryMedia')
            .values({
              mediaId: media.id,
              categoryId: c,
            })
            .execute();
        });
      }
    });
  }
  console.log('Created ' + count + ' media');
}

async function createPartners(count: number) {
  for (let i = 0; i < count; i++) {
    await db.transaction().execute(async trx => {
      const basicPlan = await trx
        .selectFrom('UserPlan')
        .select('id')
        .where('code', '=', 'basic')
        .executeTakeFirstOrThrow();
      const standartPlan = await trx
        .selectFrom('UserPlan')
        .select('id')
        .where('code', '=', 'standart')
        .executeTakeFirstOrThrow();

      const basicPartnerPlan = await trx
        .insertInto('PartnerPlan')
        .values({
          planId: basicPlan.id,
          startDate: new Date(),
          endDate: new Date(100),
        })
        .returning('id')
        .executeTakeFirstOrThrow();
      const standartPartnerPlan = await trx
        .insertInto('PartnerPlan')
        .values({
          planId: standartPlan.id,
          startDate: new Date(),
          endDate: new Date(100),
        })
        .returning('id')
        .executeTakeFirstOrThrow();
      const hashedPassword = await hash('sunshine');
      await trx
        .insertInto('User')
        .values({
          partnerPlanId: faker.helpers.arrayElement([
            basicPartnerPlan.id,
            standartPartnerPlan.id,
          ]),
          requestSend: true,
          requestStatus: 'REQUEST_APPROVED',
          bio: faker.lorem.paragraph(),
          email: faker.internet.email(),
          role: Role.ROLE_USER,
          type: UserType.USER_PARTNER,
          organizationName: faker.company.name(),
          phoneNumber: faker.phone.number(),
          contact: {
            phone_primary: faker.phone.number(),
            phone_secondary: faker.phone.number(),
          },
          password: hashedPassword,
        })
        .execute();
    });
  }
  console.log('Created ' + count + ' partners');
}

async function createVolunteers(count: number) {
  const skills = await db.selectFrom('Skill').selectAll().execute();
  for (let i = 0; i < count; i++) {
    await db.transaction().execute(async trx => {
      const hashedPassword = await hash('sunshine');
      const user = await trx
        .insertInto('User')
        .values({
          bio: faker.lorem.paragraph(),
          email: faker.internet.email(),
          requestSend: true,
          requestStatus: 'REQUEST_APPROVED',
          role: Role.ROLE_USER,
          type: UserType.USER_VOLUNTEER,
          phoneNumber: faker.phone.number(),
          registerCode: faker.phone.number(),
          firstName: faker.person.firstName('male'),
          lastName: faker.person.lastName('male'),
          gender: faker.person.gender(),
          birthDate: faker.date.birthdate(),
          contact: {
            phone_primary: faker.phone.number(),
            phone_secondary: faker.phone.number(),
          },
          password: hashedPassword,
        })
        .returning('id')
        .executeTakeFirstOrThrow();
      for (let j = 0; j < 5; j++) {
        await trx
          .insertInto('UserSkill')
          .values({
            userId: user.id,
            skillId: faker.helpers.arrayElement(skills.map(s => s.id)),
          })
          .execute();
      }
    });
  }
  console.log('Created ' + count + ' volunteers');
}

async function createEvents(count: number) {
  const user = await db
    .selectFrom('User')
    .select('id')
    .where('type', '=', 'USER_PARTNER')
    .execute();
  const userIds = user ? user.map(u => u.id) : [];
  const volunteers = await db
    .selectFrom('User')
    .select('id')
    .where('type', '=', 'USER_VOLUNTEER')
    .execute();
  const volunteerIds = volunteers ? volunteers.map(v => v.id) : [];
  const categories = await db
    .selectFrom('Category')
    .select('id')
    .where('type', '=', 'event')
    .execute();
  const categoryIds = categories ? categories.map(c => c.id) : [];

  for (let i = 0; i < count; i++) {
    const betweens = faker.date.betweens({
      from: '2023-01-01T00:00:00.000Z',
      to: '2024-12-01T00:00:00.000Z',
      count: 2,
    });
    await db.transaction().execute(async trx => {
      const ownerId = faker.helpers.arrayElement(userIds);
      const event = await trx
        .insertInto('Event')
        .values({
          slug: slugify(faker.lorem.words(5)),
          featured: faker.datatype.boolean(),
          type: faker.helpers.enumValue(EventType),
          title: faker.person.jobDescriptor(),
          description: faker.lorem.paragraph(),
          contact: {
            phone: faker.phone.number(),
            email: faker.internet.email(),
          },
          location: faker.location.streetAddress(),
          startTime: betweens[0],
          endTime: betweens[1],
          ownerId: ownerId,
          enabled: true,
          status: faker.helpers.enumValue(ProjectStatus),
        })
        .returning('id')
        .executeTakeFirstOrThrow();

      if (categoryIds.length > 0) {
        categoryIds.map(c => {
          trx
            .insertInto('CategoryEvent')
            .values({
              eventId: event.id,
              categoryId: c,
            })
            .execute();
        });
      }
      for (let j = 0; j < 2; j++) {
        trx
          .insertInto('EventCollaborator')
          .values({
            eventId: event.id,
            userId: faker.helpers.arrayElement(
              userIds.filter(u1 => u1 !== ownerId)
            ),
            status: RequestStatus.REQUEST_APPROVED,
          })
          .execute();
      }
      for (let j = 0; j < faker.number.int({ min: 5, max: 10 }); j++) {
        trx
          .insertInto('EventParticipator')
          .values({
            eventId: event.id,
            userId: faker.helpers.arrayElement(
              volunteerIds.filter(v1 => v1 !== ownerId)
            ),
            status: RequestStatus.REQUEST_APPROVED,
          })
          .execute();
      }
    });
  }
  console.log('Created ' + count + ' events');
}

async function createProjects(count: number) {
  const user = await db
    .selectFrom('User')
    .select('id')
    .where('type', '=', 'USER_PARTNER')
    .execute();
  const userIds = user ? user.map(u => u.id) : [];
  const categories = await db
    .selectFrom('Category')
    .select('id')
    .where('type', '=', 'project')
    .execute();
  const categoryIds = categories ? categories.map(c => c.id) : [];

  for (let i = 0; i < count; i++) {
    const betweens = faker.date.betweens({
      from: '2023-01-01T00:00:00.000Z',
      to: '2024-12-01T00:00:00.000Z',
      count: 2,
    });
    await db.transaction().execute(async trx => {
      const ownerId = faker.helpers.arrayElement(userIds);
      const project = await trx
        .insertInto('Project')
        .values({
          slug: slugify(faker.lorem.words(5)),
          type: faker.helpers.enumValue(ProjectType),
          title: faker.person.jobDescriptor(),
          description: faker.lorem.paragraph(),
          contact: {
            phone: faker.phone.number(),
            email: faker.internet.email(),
          },
          link: faker.internet.url(),
          startTime: betweens[0],
          endTime: betweens[1],
          goalAmount: faker.number.int({ min: 10000, max: 120000000 }),
          currentAmount: faker.number.int({ min: 10000, max: 120000000 }),
          ownerId: ownerId,
          enabled: true,
          status: faker.helpers.enumValue(ProjectStatus),
          featured: faker.datatype.boolean(),
        })
        .returning('id')
        .executeTakeFirstOrThrow();
      if (categoryIds.length > 0) {
        categoryIds.map(c => {
          trx
            .insertInto('CategoryProject')
            .values({
              projectId: project.id,
              categoryId: c,
            })
            .execute();
        });
      }
      for (let j = 0; j < 2; j++) {
        trx
          .insertInto('ProjectCollaborator')
          .values({
            projectId: project.id,
            userId: faker.helpers.arrayElement(
              userIds.filter(u1 => u1 !== ownerId)
            ),
            status: RequestStatus.REQUEST_APPROVED,
          })
          .execute();
      }
    });
  }
  console.log('Created ' + count + ' projects');
}

async function createDonations(count: number) {
  const project = await db
    .selectFrom('Project')
    .select('id')
    .where('type', '=', 'FUNDRAISING')
    .execute();
  const user = await db.selectFrom('User').select('id').execute();

  for (let i = 0; i < count; i++) {
    await db
      .insertInto('Donation')
      .values({
        amount: faker.number.int({ min: 1000, max: 9999999 }),
        isPublicName: faker.datatype.boolean(30),
        projectId: faker.helpers.arrayElement(project.map(p => p.id)),
        userId: faker.helpers.arrayElement(user.map(u => u.id)),
      })
      .execute();
  }
  console.log('Created ' + count + ' Donation');
}

async function main() {
  await clearData();
  await db
    .insertInto('UserPlan')
    .values([
      {
        description: 'Basic plan',
        name: 'Basic',
        code: 'basic',
        duration: 100,
        price: 0,
        originalPrice: 0,
      },
      {
        description: 'Standart plan',
        name: 'Standart',
        code: 'standart',
        duration: 10,
        price: 0,
        originalPrice: 0,
      },
    ])
    .returning('id')
    .executeTakeFirstOrThrow();

  await createSkills(20);
  await createCategories(20);
  await createPartners(10);
  await createVolunteers(20);
  await createEvents(50);
  await createProjects(50);
  await createMedia(40);
  await createDonations(300);
  // await seedWorldCountries();
}

main();
