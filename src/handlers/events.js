import Boom from 'boom';
import moment from 'moment';
import { resizeImage } from '../utils/image';

import {
  dbGetEvents,
  dbGetEvent,
  dbCreateEvent,
  dbDelEvent,
  dbUpdateEvent,
  dbGetEventParticipantsNum,
} from '../models/events';

export const getEvents = (request, reply) =>
  dbGetEvents(request.params.userId).then(reply);

export const getEventParticipantsNum = (request, reply) =>
  dbGetEventParticipantsNum().then(reply);

export const getEvent = (request, reply) =>
  dbGetEvent(request.params.eventId).then(reply);

export const CreateEvent = async (request, reply) => {
  const fields = {};

  // request.payload.forEach((field) => { fields[field] = request.payload[field]; });

  for (const field in request.payload) {
    fields[field] = request.payload[field];
  }

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.eventImage) {
    const buf = Buffer.from(fields.eventImage, 'base64');
    await resizeImage(buf).then(resized => (fields.eventImage = resized));
  }
  console.log(
    'request.payload.participantsMix!!!!!!!!!!',
    request.payload.participantsMix,
  );
  dbCreateEvent({
    ...fields,
    createdAt: moment(),
    title: request.payload.title,
    description: request.payload.description,
    address: request.payload.address,
    city: request.payload.city,
    eventDate: request.payload.eventDate,
    minParticipants: request.payload.minParticipants,
    maxParticipants: request.payload.maxParticipants,
    participantsMix: request.payload.participantsMix,
  }).then(reply);
};

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

// TODO: only the creator of the event can delete it
// Delete a Event that is connected to a user
export const delEvent = (request, reply) => {
  return dbDelEvent(request.params.id).then(reply);
};
