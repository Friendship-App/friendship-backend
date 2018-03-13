import { merge } from 'lodash';
import Joi from 'joi';
import { getAuthWithScope } from '../utils/auth';

import { getEvents, getEvent, CreateEvent, delEvent } from '../handlers/events';

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
      createdAt: Joi.date().timestamp(),
    },
  },
};

const events = [
  // Get a list of all events
  {
    method: 'GET',
    path: '/events',
    config: getAuthWithScope('user'),
    handler: getEvents,
  },
  // Create a new event
  {
    method: 'POST',
    path: '/events',
    config: merge({}, validateEventFields, getAuthWithScope('user')),
    handler: CreateEvent,
  },
  // Delete event
  {
    method: 'DELETE',
    path: '/events/{eventid}',
    config: merge({}, validateEventId, getAuthWithScope('user')),
    handler: delEvent,
  },
  // Get info about a specific event
  {
    method: 'GET',
    path: '/event/{eventId}',
    config: merge({}, validateEventId, getAuthWithScope('user')),
    handler: getEvent,
  },
];

export default events;

export const routes = server => server.route(events);
