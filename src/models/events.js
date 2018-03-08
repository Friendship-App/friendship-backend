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
    `SELECT   "id","createdAt", "title", "eventImage", "description", "city", "address", "eventDate" FROM "events" `,
  );

  var newArrayDataOfOjbect = Object.values(events.rows);
  calculateRecommandationByDate(newArrayDataOfOjbect);
  calculateRecommandationByNumberOfParticipants(newArrayDataOfOjbect);
  return newArrayDataOfOjbect;
};

const calculateRecommandationByDate = events => {
  events.sort(function(a, b) {
    return new Date(b.eventDate) - new Date(a.eventDate);
  });
  events.map((event, index) => {
    event.dateSortIndex = index + 1;
  });
  //console.log(events);
};
const calculateRecommandationByNumberOfParticipants = events => {
  const numbers = [];
  events.map(async event => {
    const participants = await knex.raw(
      `SELECT COUNT(DISTINCT "userId") as NumberOfUsers  FROM "eventParticipants"
            WHERE "eventParticipants"."eventId" = ${event.id}`,
    );
    numbers.push(participants.rows[0].numberofusers);
  });
  console.log('ITS SECOOOOOOOONd', numbers);
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
