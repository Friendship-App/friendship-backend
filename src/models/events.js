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
    `SELECT   "id","createdAt", "title", "eventImage", "description", "city", "address", "eventDate" FROM "events"  ORDER BY "eventDate" ASC`,
  );
  console.log('EVENTS', events);

  const newArrayDataOfOjbect = Object.values(events.rows);
  await calculateRecommandationByNumberOfParticipants(newArrayDataOfOjbect);
  calculateTheIndexForSortByParticipants(newArrayDataOfOjbect);
  await calculateRecommandationByCommonPersonalityNaahsYeahs(
    newArrayDataOfOjbect,
    userId,
  );
  calculateTheIndexForSortByYeahsNaahs(newArrayDataOfOjbect);
  //calculateRecommandationByEventUserLocation(newArrayDataOfOjbect, userId);
  const eventsArray = calculateTheIndexForDateRecommandation(
    newArrayDataOfOjbect,
  );

  calculateFinalSortRate(eventsArray);

  return eventsArray;
};

const calculateFinalSortRate = events => {
  events.map(async event => {
    event.reccomendationIndex =
      event.dateIndex * 3 +
      event.commonNaahYeahsForUserIndex * 4 +
      event.numberParticipantsIndex * 1;
  });
  events.sort(function(a, b) {
    return b.reccomendationIndex - a.reccomendationIndex;
  });
};

const calculateRecommandationByEventUserLocation = async (events, userId) => {
  const user = await knex.raw(`SELECT "users"."id","users"."username", "locations"."name" as location FROM "users"
      left join "user_location"
      ON "user_location"."userId" = "users"."id"
      left join "locations"
      ON "locations"."id" = "user_location"."locationId"
      WHERE "users"."id" = ${userId}`);
  console.log('USEr ------ ', user.rows[0].location);
  var origins = [user.rows[0].location];

  var distance = require('google-distance');
  const array = events.map(async event => {
    const distance12 = await distance.get(
      {
        origin: 'Helsinki',
        destination: 'Kiev',
      },
      // function(err, data) {
      //   if (err) return console.log(err);
      //   event.durationValue = data.durationValue;
      //   console.log(data.durationValue);
      //   return event
      // },
    );
    console.log('distance  ________', distance12);
  });
  console.log('EVENTS PROMISE ________', array);

  const eventsArray = await Promise.all(array);
  console.log('EVENTS ________', eventsArray);

  /*  const GoogleDistanceApi = require('google-distance-api');
  const options = {
    key: 'AIzaSyAtoAQP13gnBjzrdFja9Nvb9blo-meL_j8',
    origins: ['Helsinki'],
    destinations: ['Kiev'],
  };
  const array = events.map(async event => {
    const data = GoogleDistanceApi.distance(options, (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log('DISTANCE', data);
    });
  });
  console.log('HAPPENS BEFORE');*/
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
  let currentDate = new Date(2018, 2, 22);
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
