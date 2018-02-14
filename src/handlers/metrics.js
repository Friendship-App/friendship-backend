import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbGetNbActiveUsers,
  dbGetRegisteredUsers,
  dbCountActiveUsers,
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
export const getNbActiveUsers = (request, reply) => {
  dbGetNbActiveUsers().then(reply);
};

export const getCountActiveUsers = (request, reply) => {
  dbCountActiveUsers().then(reply);
};
