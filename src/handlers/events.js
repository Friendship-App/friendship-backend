import Boom from 'boom';
import moment from 'moment';

import {
  dbGetEvents,
  dbGetEvent,
  dbCreateEvent,
  dbDelEvent,
  dbUpdateEvent,
} from '../models/events';

export const getEvents = (request, reply) =>
  dbGetEvents(request.params.userId).then(reply);

export const getEvent = (request, reply) =>
  dbGetEvent(request.params.eventId).then(reply);

export const CreateEvent = (request, reply) =>
  dbCreateEvent({
    ...request.payload,
    createdAt: moment(),
    title: request.payload.title,
    eventImage: request.payload.eventImage,
    description: request.payload.description,
    address: request.payload.address,
    city: request.payload.city,
    eventDate: request.payload.eventDate,
    minParticipants: request.payload.minParticipants,
    maxParticipants: request.payload.maxParticipants,
    participantsMix: request.payload.participantsMix,
  }).then(reply);

export const UpdateEvent = async (request, reply) => {
  const fields = {
    createdAt: moment(),
    title: request.payload.title,
    eventImage: request.payload.eventImage,
    description: request.payload.description,
    address: request.payload.address,
    city: request.payload.city,
    eventDate: request.payload.eventDate,
    minParticipants: request.payload.minParticipants,
    maxParticipants: request.payload.maxParticipants,
    participantsMix: request.payload.participantsMix,
  };

  return dbUpdateEvent(request.params.eventId, fields).then(reply);
};

// Delete a Event that is connected to a user
export const delEvent = (request, reply) => {
  return dbDelEvent(request.params.id).then(reply);
};
