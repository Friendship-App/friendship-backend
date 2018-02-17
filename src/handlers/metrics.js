import Boom from 'boom';
import moment from 'moment';

import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbGetNbActiveUsers,
  dbGetRegisteredUsers,
  dbGetMetrics
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

export const getNbActiveUsers = (request, reply) => {
  dbGetNbActiveUsers().then(reply)
};

export const getNbRegisteredUsers=(reqest,reply)=>{
  dbGetRegisteredUsers().then(reply)
}
