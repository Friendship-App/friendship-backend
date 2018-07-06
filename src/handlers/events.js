import moment from 'moment';

import {
  dbCreateEvent,
  dbDelEvent,
  dbGetEvent,
  dbGetEventParticipantsNum,
  dbGetEvents,
  dbUpdateEvent,
} from '../models/events';
import {notifyEventCancelled} from "../utils/notifications";
import {dbGetParticipantsTokenAndEventDetails} from "../models/eventParticipants";
import {dbCreateChatroom} from "../models/chatrooms";

export const getEvents = (request, reply) => {
  dbGetEvents(request.pre.user.id).then(
    res => {
      const events = res;
      for (let i = events.length - 1; i > -1; i--) {
        if (moment(moment(events[i].date).format()).isBefore(request.params.time) || events[i].maxParticipants <= events[i].participants) {
          events.splice(i, 1);
        }
      }
      return reply(events);
    }
  );


};

export const getEventParticipantsNum = (request, reply) =>
  dbGetEventParticipantsNum().then(reply);

export const getEvent = (request, reply) =>
  dbGetEvent(request.params.eventId).then(reply);

export const CreateEvent = async (request, reply) => {
  const fields = {};

  for (const field in request.payload) {
    fields[field] = request.payload[field];
  }

  const chatroomId = await dbCreateChatroom({
    user_creator_id: request.payload.hostId,
    user_receiver_id: null,
    event: true
  }).then(res => res.id);

  dbCreateEvent({
    createdAt: moment(),
    title: request.payload.title,
    description: request.payload.description,
    address: request.payload.address,
    city: request.payload.city,
    eventDate: request.payload.eventDate,
    minParticipants: request.payload.minParticipants,
    maxParticipants: request.payload.maxParticipants,
    participantsMix: request.payload.participantsMix,
    eventImage: request.payload.eventImage,
    hostId: request.payload.hostId,
    chatroomId
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
  return dbGetParticipantsTokenAndEventDetails(request.params.id, request.pre.user.id)
    .then((participantsTokens) => {
      return dbDelEvent(request.params.id).then(() => {
        notifyEventCancelled(participantsTokens);
        return reply();
      })
    })
};
