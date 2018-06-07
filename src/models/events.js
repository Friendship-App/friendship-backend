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
  'events.id',
  'events.createdAt',
  'events.title',
  'events.eventImage',
  'events.description',
  'events.city',
  'events.address',
  'events.eventDate',
  'events.minParticipants',
  'events.maxParticipants as maxParticipants',
  'events.participantsMix',
  'events.hostId',
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
  const loveTags = await knex('user_tag')
    .where('userId', userId)
    .andWhere('love', true)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });

  const hateTags = await knex('user_tag')
    .where('userId', userId)
    .andWhere('love', false)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });

  const userLocations = await knex('user_location')
    .leftJoin('locations', 'locations.id', 'user_location.locationId')
    .where('userId', userId)
    .select(knex.raw('array_agg(DISTINCT locations.name) as locationsArray'))
    .then(res => {
      return res[0].locationsarray;
    });

  return await knex('events')
    .leftJoin('eventParticipants as participants', 'participants.eventId', 'events.id')
    .leftJoin('users', 'users.id', 'participants.userId')
    .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
    .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
    .whereIn('events.city', userLocations)
    .andWhere(knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`))
    .andWhere(knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`))
    .select([
      ...eventFields,
      knex.raw('count(DISTINCT participants."userId") AS participants'),
      knex.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
      knex.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
    ])
    .groupBy('events.id')
    .orderByRaw('participants DESC, events."eventDate", loveCommon, hateCommon');

  /*const events = await knex.raw(
    `SELECT   "id","createdAt","hostId", "title", "eventImage", "description", "city", "address","minParticipants","maxParticipants","participantsMix", "eventDate" FROM "events" ORDER BY "eventDate" ASC`,
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
  await checkifCurrentUserisJoining(newArrayDataOfOjbect, userId);

  calculateFinalSortRate(newArrayDataOfOjbect);

  await calculateCompatibilityScore(newArrayDataOfOjbect, userId);
  const eventsToReturn = [];
  for (let i = 0; i < newArrayDataOfOjbect.length; i++) {
    if (
      parseInt(newArrayDataOfOjbect[i].compatibilityScore) >=
      parseInt(newArrayDataOfOjbect[i].participantsMix)
    ) {
      eventsToReturn.push(newArrayDataOfOjbect[i]);
    } else if (newArrayDataOfOjbect[i].participantsMix == null) {
      eventsToReturn.push(newArrayDataOfOjbect[i]);
    }
  }
  return eventsToReturn;*/
};

const checkifCurrentUserisJoining = async (events, userId) => {
  const array = events.map(async (event, index) => {
    const participantsObj = await knex.raw(`SELECT "userId" FROM "eventParticipants"
            WHERE "eventParticipants"."eventId" = ${event.id}`);
    const participants = [];
    participantsObj.rows.map(eventParticipant => {
      participants.push(parseInt(eventParticipant.userId));
    });

    if (participants.includes(parseInt(userId))) {
      event.userIsJoining = true;
    } else {
      event.userIsJoining = false;
    }
  });
  const eventsArray = await Promise.all(array);
  return eventsArray;
};

const calculateCompatibilityScore = async (events, userId) => {
  const totalScore = await calcTotalYeahsNahs();
  const indexesToRemove = [];
  const array = events.map(async (event, index) => {
    const hateCommon = await checkHateCommon(event.hostId, userId);
    const loveCommon = await checkloveCommon(event.hostId, userId);
    const personalitiesCommon = await checkPersonalitiesCommon(
      event.hostId,
      userId,
    );

    const compatibilityScoreLong =
      (loveCommon + personalitiesCommon + hateCommon) / totalScore * 100;

    const compatibilityScore = compatibilityScoreLong.toFixed(0);
    event.compatibilityScore = compatibilityScore;
  });
  const eventsArray = await Promise.all(array);

  return eventsArray;
};

const calcTotalYeahsNahs = async () => {
  const totalPersonalities = await knex.raw(
    `SELECT count(id) as "totalPersonalities"  FROM personalities`,
  );
  const totalYeahsNahs = await knex.raw(
    `SELECT count(id) as "totalYeahsNahs"  FROM tags`,
  );
  const totalScore =
    +totalPersonalities.rows[0].totalPersonalities +
    +totalYeahsNahs.rows[0].totalYeahsNahs;
  return totalScore;
};
const checkPersonalitiesCommon = async (hostId, userId) => {
  const personalitiesCommon = await knex.raw(`SELECT "users"."id","users"."avatar","users"."username",
    count(DISTINCT "personalities"."id") AS "personalitiesCommon"
    FROM "users"
    left join "user_personality"
    ON "user_personality"."userId" = "users"."id"
    left join "personalities"
    ON "personalities"."id" = "user_personality"."personalityId"
    WHERE "users"."id" IN (SELECT "users"."id"  FROM "users"
          WHERE "users"."id"  = ${userId})
    AND "personalities"."name" IN (SELECT "personalities"."name" FROM "user_personality"
                      left join "personalities" ON "personalities"."id" = "user_personality"."personalityId"
                      WHERE "user_personality"."userId" = ${hostId})
    GROUP BY "users"."id"`);
  return personalitiesCommon.rows[0]
    ? parseInt(personalitiesCommon.rows[0].personalitiesCommon)
    : 0;
};

const checkHateCommon = async (hostId, userId) => {
  const hateCommon = await knex.raw(`SELECT "users"."id","users"."avatar","users"."username",
    count(DISTINCT "tags"."name") AS "hateCommon"
    FROM "users"
    left join "user_tag"
    ON "user_tag"."userId" = "users"."id"
    left join "tags"
    ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_tag"."love" = false
    AND "users"."id" IN (SELECT "users"."id"  FROM "users"
          WHERE "users"."id"  = ${userId})
    AND "tags"."name" IN (SELECT "tags"."name" FROM "user_tag"
                      left join "tags" ON "tags"."id" = "user_tag"."tagId"
                      WHERE "user_tag"."userId" = ${hostId}
                      AND "user_tag"."love" = false)
    GROUP BY "users"."id"`);

  return hateCommon.rows[0] ? parseInt(hateCommon.rows[0].hateCommon) : 0;
};

const checkloveCommon = async (hostId, userId) => {
  const loveCommon = await knex.raw(`SELECT "users"."id","users"."avatar","users"."username",
    count(DISTINCT "tags"."name") AS "loveCommon"
    FROM "users"
    left join "user_tag"
    ON "user_tag"."userId" = "users"."id"
    left join "tags"
    ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_tag"."love" = true
    AND "users"."id" IN (SELECT "users"."id"  FROM "users"
          WHERE "users"."id"  = ${userId})
    AND "tags"."name" IN (SELECT "tags"."name" FROM "user_tag"
                      left join "tags" ON "tags"."id" = "user_tag"."tagId"
                      WHERE "user_tag"."userId" = ${hostId}
                      AND "user_tag"."love" = true)
    GROUP BY "users"."id"`);
  return loveCommon.rows[0] ? parseInt(loveCommon.rows[0].loveCommon) : 0;
};

const calculateFinalSortRate = events => {
  events.map(async event => {
    event.reccomendationIndex =
      event.dateIndex * 3 +
      event.commonNaahYeahsForUserIndex * 4 +
      event.numberParticipantsIndex * 1 +
      event.locationSortIndex * 2;
  });
  events.sort(function (a, b) {
    return b.reccomendationIndex - a.reccomendationIndex;
  });
};
const calculateTheIndexRecommandationByEventUserLocation = events => {
  events.sort(function (a, b) {
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
  const array = [];
  try {
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
  } catch (error) {
    console.log('I AM CATCHING ERRORS ', error);
  }
  let eventsArray = [];
  if (array.length > 0) {
    eventsArray = await Promise.all(array);
  } else {
    eventsArray = events.map(event => {
      event.durationValue = 0;
    });
  }

  return eventsArray;
};

const calculateRecommandationByCommonPersonalityNaahsYeahs = async (events,
                                                                    userId,) => {
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

  eventsInPast.sort(function (a, b) {
    return a.eventDate - b.eventDate;
  });

  events.map((event, index) => {
    let eventDate = new Date(event.eventDate);
    if (currentDate < eventDate) {
      eventsInFuture.push(event);
    }
  });
  eventsInFuture.sort(function (a, b) {
    return b.eventDate - a.eventDate;
  });

  const eventsToReturn = eventsInPast.concat(eventsInFuture);

  eventsToReturn.map((event, index) => {
    event.dateIndex = index + 1;
  });

  return eventsToReturn;
};
const calculateTheIndexForSortByYeahsNaahs = events => {
  events.sort(function (a, b) {
    return a.commonNaahYeahsForUser - b.commonNaahYeahsForUser;
  });
  events.map((event, index) => {
    event.commonNaahYeahsForUserIndex = index + 1;
    delete event['commonNaahYeahsForUser'];
  });
};

const calcualteParticipantNum = async eventId => {
  const participants = await knex.raw(
    `SELECT COUNT(DISTINCT "userId") as NumberOfUsers  FROM "eventParticipants"
          WHERE "eventParticipants"."eventId" = ${eventId}`,
  );
  return participants.rows[0].numberofusers;
};

const calculateRecommandationByNumberOfParticipants = async events => {
  const array = events.map(async event => {
    event.numberOfParticipants = await calcualteParticipantNum(event.id);
    return event;
  });
  const eventsArray = await Promise.all(array);
  return eventsArray;
};

const calculateTheIndexForSortByParticipants = events => {
  events.sort(function (a, b) {
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
    .where({id});
  const eventParticipantsNum = await calcualteParticipantNum(id);

  if (parseInt(eventParticipantsNum) >= parseInt(event.maxParticipants)) {
    event.maxParticipantNumberExceed = true;
  } else {
    event.maxParticipantNumberExceed = false;
  }

  return event;
};

export const dbGetEventParticipantsNum = async () => {
  const participants = await knex.raw(
    `SELECT  "eventParticipants"."eventId","users"."avatar" from "users"
      LEFT JOIN "eventParticipants" ON "users"."id" = "eventParticipants"."userId"
      WHERE "eventParticipants"."eventId" NOTNULL`,
  );
  return participants.rows;
};

export const dbCreateEvent = ({...fields}) =>
  knex.transaction(async trx => {
    const report = await trx('events')
      .insert(fields)
      .returning('*')
      .then(results => results[0]);
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
    .where({id})
    .del();

export const dbUpdateEvent = (id, fields) =>
  knex('events')
    .update({...fields})
    .where({id})
    .returning('*');
