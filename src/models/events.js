import knex from '../utils/db';
import moment from 'moment';

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
  'minParticipants',
  'maxParticipants',
  'participantsMix',
  'hostId',
];

const userListFields = [
  'users.id',
  'createdAt',
  'lastActive',
  'email',
  'username',
  'location',
];

//export const dbGetEvents = () => knex('events').select(eventFields);

export const dbGetEvents = async userId => {
  const events = await knex.raw(
    `SELECT   "id","createdAt","hostId", "title", "eventImage", "description", "city", "address",'minParticipants','maxParticipants','participantsMix', "eventDate" FROM "events"  WHERE DATE("eventDate") >= DATE'today' ORDER BY "eventDate" ASC`,
  );

  const newArrayDataOfOjbect = Object.values(events.rows);
  await calculateRecommandationByNumberOfParticipants(newArrayDataOfOjbect);
  calculateTheIndexForSortByParticipants(newArrayDataOfOjbect);
  await calculateRecommandationByCommonPersonalityNaahsYeahs(
    newArrayDataOfOjbect,
    userId,
  );
  calculateTheIndexForSortByYeahsNaahs(newArrayDataOfOjbect);
  await calculateRecommandationByEventUserLocation(
    newArrayDataOfOjbect,
    userId,
  );
  calculateTheIndexRecommandationByEventUserLocation(newArrayDataOfOjbect);

  calculateTheIndexForDateRecommandation(newArrayDataOfOjbect);

  calculateFinalSortRate(newArrayDataOfOjbect);

  return newArrayDataOfOjbect;
};

const calculateFinalSortRate = events => {
  events.map(async event => {
    event.reccomendationIndex =
      event.dateIndex * 3 +
      event.commonNaahYeahsForUserIndex * 4 +
      event.numberParticipantsIndex * 1 +
      event.locationSortIndex * 2;
  });
  events.sort(function(a, b) {
    return b.reccomendationIndex - a.reccomendationIndex;
  });
};
const calculateTheIndexRecommandationByEventUserLocation = events => {
  events.sort(function(a, b) {
    return a.durationValue - b.durationValue;
  });
  events.map((event, index) => {
    event.locationSortIndex = index + 1;
    delete event['durationValue'];
  });
  return events;
};

const calculateRecommandationByEventUserLocation = async (events, userId) => {
  const user = await knex.raw(`SELECT "users"."id","users"."username", "locations"."name" as location FROM "users"
      left join "user_location"
      ON "user_location"."userId" = "users"."id"
      left join "locations"
      ON "locations"."id" = "user_location"."locationId"
      WHERE "users"."id" = ${userId}`);
  var origins = [user.rows[0].location];

  var distance = require('google-distance');
  const array = events.map(async event => {
    const testPromise = new Promise((resolve, reject) => {
      distance.get(
        {
          origin: user.rows[0].location,
          destination: event.city,
          //origin: 'Helsinki',
          //destination: 'Berlin',
        },
        (err, data) => {
          if (err) {
            event.durationValue = 0;
            resolve(event);
          } else {
            event.durationValue = data.durationValue;
            resolve(event);
          }
        },
      );
    });

    return testPromise;
  });
  const eventsArray = await Promise.all(array);
  return eventsArray;
};

const calculateRecommandationByCommonPersonalityNaahsYeahs = async (
  events,
  userId,
) => {
  const array = events.map(async event => {
    const participantsCommonNaahYeahRow = await dbGetEventParticipants(
      event.id,
      userId,
    );
    const participantsCommonNaahYeah = participantsCommonNaahYeahRow.rows;
    let sumOfYeahsNaahs = 0;
    participantsCommonNaahYeah.map(async participant => {
      sumOfYeahsNaahs += +participant.hateCommon;
      sumOfYeahsNaahs += +participant.loveCommon;
    });
    event.commonNaahYeahsForUser = sumOfYeahsNaahs;
  });
  const eventsArray = await Promise.all(array);
  return eventsArray;
};

const calculateTheIndexForDateRecommandation = events => {
  let currentDate = new Date();
  let eventsInPast = [];
  let eventsInFuture = [];
  events.map((event, index) => {
    let eventDate = new Date(event.eventDate);
    if (currentDate > eventDate) {
      eventsInPast.push(event);
    }
  });

  eventsInPast.sort(function(a, b) {
    return a.eventDate - b.eventDate;
  });

  events.map((event, index) => {
    let eventDate = new Date(event.eventDate);
    if (currentDate < eventDate) {
      eventsInFuture.push(event);
    }
  });
  eventsInFuture.sort(function(a, b) {
    return b.eventDate - a.eventDate;
  });
  const eventsToReturn = eventsInPast.concat(eventsInFuture);
  eventsToReturn.map((event, index) => {
    event.dateIndex = index + 1;
  });
  return eventsToReturn;
};
const calculateTheIndexForSortByYeahsNaahs = events => {
  events.sort(function(a, b) {
    return a.commonNaahYeahsForUser - b.commonNaahYeahsForUser;
  });
  events.map((event, index) => {
    event.commonNaahYeahsForUserIndex = index + 1;
    delete event['commonNaahYeahsForUser'];
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
    return a.numberOfParticipants - b.numberOfParticipants;
  });
  events.map((event, index) => {
    event.numberParticipantsIndex = index + 1;
    delete event['numberOfParticipants'];
  });
};

export const dbGetEvent = async id => {
  const event = await knex('events')
    .first()
    .where({ id });

  console.log('- - - - - - - - - - - - - - - - - START 1');
  console.log(event.eventImage);
  console.log('- - - - - - - - - - - - - - - - - END 1');

  if (event.eventImage) {
    event.eventImage = event.eventImage.toString('base64');
  }

  console.log('- - - - - - - - - - - - - - - - - START 2');
  console.log(event.eventImage);
  console.log('- - - - - - - - - - - - - - - - - END 2');

  return event;
};

export const dbCreateEvent = ({ ...fields }) =>
  knex.transaction(async trx => {
    const report = await trx('events')
      .insert(fields)
      .returning('*')
      .then(results => results[0]);
    console.log('REPORT ID', report.id);
    console.log('EVENTSHOST ID', report.hostId);
    await trx('eventParticipants')
      .insert({
        userId: report.hostId,
        eventId: report.id,
        createdAt: moment(),
      })
      .then();
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
