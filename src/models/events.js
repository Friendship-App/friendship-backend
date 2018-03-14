import knex from '../utils/db';

import {
  dbGetEventParticipants,
  dbCreateEventParticipation,
  dbGetEventParticipation,
  dbDelEventParticipation,
  dbGetEventPerssonality,
  dbGetEventTopYeahsNahs,
} from './eventParticipants';

const eventFields = [
  'id',
  'createdAt',
  'title',
  'eventImage',
  'description',
  'city',
  'address',
  'eventDate',
];

//export const dbGetEvents = () => knex('events').select(eventFields);

export const dbGetEvents = async userId => {
  const events = await knex.raw(
    `SELECT   "id","createdAt", "title", "eventImage", "description", "city", "address", "eventDate" FROM "events" ORDER BY "eventDate" DESC`,
  );

  const newArrayDataOfOjbect = Object.values(events.rows);
  calculateTheIndexForDateRecommandation(newArrayDataOfOjbect);
  await calculateRecommandationByNumberOfParticipants(newArrayDataOfOjbect);
  calculateTheIndexForSortByParticipants(newArrayDataOfOjbect);
  await calculateRecommandationByCommonPersonalityNaahsYeahs(
    newArrayDataOfOjbect,
    userId,
  );
  return newArrayDataOfOjbect;
};

const calculateRecommandationByCommonPersonalityNaahsYeahs = async (
  events,
  userId,
) => {
  const array = events.map(async event => {
    const participantsWithFeaturesPromises = await knex.raw(
      `SELECT "users"."id","users"."emoji","users"."username",
        count(DISTINCT "tags"."name") AS "hateCommon"
        FROM "users"
        left join "user_tag"
        ON "user_tag"."userId" = "users"."id"
        left join "tags"
        ON "tags"."id" = "user_tag"."tagId"
        WHERE "user_tag"."love" = ${false}
        AND "users"."id" != ${userId}
        AND "users"."id" IN (SELECT "users"."id"  FROM "users"
              left join "eventParticipants"
              ON "eventParticipants"."userId" = "users"."id"
              left join "events"
              ON "events"."id" = "eventParticipants"."eventId"
              WHERE "eventParticipants"."eventId" = ${event.Id})
        AND "tags"."name" IN (SELECT "tags"."name" FROM "user_tag"
                          left join "tags" ON "tags"."id" = "user_tag"."tagId"
                          WHERE "user_tag"."userId" = ${userId}
                          AND "user_tag"."love" = ${false})
        GROUP BY "users"."id"`,
    );
    return event;
    const participantsWithFeatures = await Promise.all(
      participantsWithFeaturesPromises,
    );
  });
};

const calculateTheIndexForDateRecommandation = events => {
  events.map((event, index) => {
    event.dateSortIndex = index + 1;
  });
};

const calculateRecommandationByNumberOfParticipants = async events => {
  const array = events.map(async event => {
    const participants = await knex.raw(
      `SELECT COUNT(DISTINCT "userId") as NumberOfUsers  FROM "eventParticipants"
            WHERE "eventParticipants"."eventId" = ${event.id}`,
    );
    event.numberOfParticipants = participants.rows[0].numberofusers;
    return event;
  });
  const eventsArray = await Promise.all(array);
  return eventsArray;
};

const calculateTheIndexForSortByParticipants = events => {
  events.sort(function(a, b) {
    return b.numberOfParticipants - a.numberOfParticipants;
  });
  events.map((event, index) => {
    event.numberParticipantsIndex = index + 1;
    delete event['numberOfParticipants'];
  });
};

export const dbGetEvent = id =>
  knex('events')
    .first()
    .where({ id });

export const dbCreateEvent = ({ ...fields }) =>
  knex.transaction(async trx => {
    const report = await trx('events')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    return report;
  });

export const dbDelEvent = id =>
  knex('events')
    .where({ id })
    .del();

export const dbUpdateEvent = (id, fields) =>
  knex('events')
    .update({ ...fields })
    .where({ id })
    .returning('*');
