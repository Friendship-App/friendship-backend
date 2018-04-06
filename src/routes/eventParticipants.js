import { merge } from 'lodash';

import Joi from 'joi';
import { getAuthWithScope } from '../utils/auth';

import {
  getEventParticipants,
  createEventParticipation,
  getEventParticipation,
  delEventParticipation,
  getEventPerssonality,
  getEventTopYeahsNahs,
} from '../handlers/eventParticipants';

const validateEventId = {
  validate: {
    params: {
      eventId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validateUserId = {
  validate: {
    params: {
      userId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const eventParticipants = [
  // Get a list of users with hate and love in common for a specific event
  {
    method: 'GET',
    path: '/eventParticipants/{eventId}/{userId}',
    config: merge(
      {},
      validateEventId,
      validateUserId,
      //getAuthWithScope('user'),
    ),
    handler: getEventParticipants,
  },
  // Get true or false depending if the user participate to the event
  {
    method: 'GET',
    path: '/eventParticipation/{eventId}/{userId}',
    config: merge(
      {},
      validateEventId,
      validateUserId,
      getAuthWithScope('user'),
    ),
    handler: getEventParticipation,
  },
  // The user join the event
  {
    method: 'POST',
    path: '/eventParticipation/{eventId}/{userId}',
    config: merge(
      {},
      validateEventId,
      validateUserId,
      getAuthWithScope('user'),
    ),
    handler: createEventParticipation,
  },
  // The user leave the event
  {
    method: 'DELETE',
    path: '/eventParticipation/{eventId}/{userId}',
    config: merge(
      {},
      validateEventId,
      validateUserId,
      getAuthWithScope('user'),
    ),
    handler: delEventParticipation,
  },
  // Get the personalities for the event
  {
    method: 'GET',
    path: '/eventPersonalities/{eventId}',
    config: merge({}, validateEventId, getAuthWithScope('user')),
    handler: getEventPerssonality,
  },
  // Get the top tags for the event
  {
    method: 'GET',
    path: '/eventTopYeahsNahs/{eventId}',
    config: merge({}, validateEventId, getAuthWithScope('user')),
    handler: getEventTopYeahsNahs,
  },
];

export default eventParticipants;

export const routes = server => server.route(eventParticipants);
