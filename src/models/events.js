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
  'events.eventDate as date',
  'events.minParticipants',
  'events.maxParticipants as maxParticipants',
  'events.participantsMix',
  'events.hostId',
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

  const eventsWithLoveAndHateInCommon = await knex('events')
    .select(knex.raw('array_agg(DISTINCT events.id) as eventids'))
    .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
    .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
    .whereIn('events.city', userLocations)
    .andWhere(knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`))
    .andWhere(knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`))
    .then(res => res[0].eventids);

  return knex.from(function () {
    this
      .select([
        ...eventFields,
        knex.raw('count(DISTINCT participants."userId") AS participants'),
        knex.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
        knex.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
      ])
      .from('events')
      .leftJoin('eventParticipants as participants', 'participants.eventId', 'events.id')
      .leftJoin('users', 'users.id', 'participants.userId')
      .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
      .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
      .whereIn('events.city', userLocations)
      .andWhere(knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`))
      .andWhere(knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`))
      .as('filteredEvents')
      .groupBy('events.id');
  }, true)
    .union(function () {
      this
        .select([
          ...eventFields,
          knex.raw('count(DISTINCT participants."userId") AS participants'),
          knex.raw(`0 AS loveCommon`),
          knex.raw(`0 AS hateCommon `),
        ])
        .from('events')
        .leftJoin('eventParticipants as participants', 'participants.eventId', 'events.id')
        .leftJoin('users', 'users.id', 'participants.userId')
        .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
        .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
        .whereIn('events.city', userLocations)
        .whereNotIn('events.id', eventsWithLoveAndHateInCommon)
        .groupBy('events.id');
    }, true)
    .as('allEvents')
    .orderByRaw('participants DESC, date DESC, loveCommon DESC, hateCommon DESC');
};

const calcualteParticipantNum = async eventId => {
  const participants = await knex.raw(
    `SELECT COUNT(DISTINCT "userId") as NumberOfUsers  FROM "eventParticipants"
          WHERE "eventParticipants"."eventId" = ${eventId}`,
  );
  return participants.rows[0].numberofusers;
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
