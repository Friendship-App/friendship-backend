import { merge } from 'lodash';
import Joi from 'joi';
import { getAuthWithScope } from '../utils/auth';

import {
  getEvents,
  getEvent,
  CreateEvent,
  delEvent,
  UpdateEvent,
  getEventParticipantsNum,
} from '../handlers/events';

const validateEventId = {
  validate: {
    params: {
      eventId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validateEventFields = {
  validate: {
    payload: {
      title: Joi.string(),
      description: Joi.string(),
      city: Joi.string(),
      address: Joi.string(),
      eventDate: Joi.date().timestamp(),
      minParticipants: Joi.string(),
      maxParticipants: Joi.string(),
      participantsMix: Joi.string(),
      createdAt: Joi.date().timestamp(),
    },
  },
};

const events = [
  // Get a list of all events
  {
    method: 'GET',
    path: '/events/{userId}',
    handler: getEvents,
  },
  // Create a new event
  {
    method: 'POST',
    path: '/events',
    //config: merge({}, getAuthWithScope('user')),
    handler: CreateEvent,
  },
  {
    method: 'GET',
    path: '/eventParticipantsNum',
    //config: merge({}, getAuthWithScope('user')),
    handler: getEventParticipantsNum,
  },
  // Delete event
  {
    method: 'PATCH',
    path: '/events/{eventId}',
    //config: merge({}, validateEventFields),
    handler: UpdateEvent,
  },
  {
    method: 'DELETE',
    path: '/events/{id}',
    config: merge({}, getAuthWithScope('user')),

    handler: delEvent,
  },
  // Get info about a specific event
  {
    method: 'GET',
    path: '/event/{eventId}',
    //config: merge({}, validateEventId, getAuthWithScope('user')),
    handler: getEvent,
  },
];

export default events;

export const routes = server => server.route(events);
