import Boom from 'boom';
import moment from 'moment';

import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbGetNbActiveUsers,
  dbGetRegisteredUsers,
  dbGetRegisteredUser,
  dbCreateRegisteredUser,
  dbCreateActiveUsersCount,
} from '../models/metrics';

export const getNbMatchesMessaging = (request, reply) => {
  dbGetNbMatchesMessaging().then(reply);
};

export const getNbMessagesByConversation = (request, reply) => {
  dbGetNbMessagesByConversation().then(reply);
};

export const getNbMessages = (request, reply) => {
  dbGetNbMessages().then(reply);
};

// danni
export const getNbRegisteredUsers = (request, reply) => {
  dbGetRegisteredUsers().then(reply);
};

// minh
export const getRegisteredUsers = (request, reply) =>
  dbGetRegisteredUser(request.params.registeredUserId).then(reply);

export const createRegisteredUser = (request, reply) =>
  dbCreateRegisteredUser({
    ...request.payload,
    users_count: request.payload.users_count,
    timestamp: moment(),
  }).then(reply);

export const getNbActiveUsers = (request, reply) =>
  dbGetNbActiveUsers().then(reply);

export const createActiveUsersCount = (request, reply) =>
  dbCreateActiveUsersCount({
    ...request.payload,
    users_count: request.payload.users_count,
    timestamp: moment(),
  }).then(reply);
