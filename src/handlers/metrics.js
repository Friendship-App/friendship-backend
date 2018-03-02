import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbDisplayRegisteredUsersData,
  dbUpdateRegisteredUsersData,
  dbDisplayActiveUsersData,
  dbUpdateActiveUsersData,
  dbDisplayActiveConversationData,
  dbUpDateActiveConversationsData,
  dbDisplayAverageConversationsLength,
  dbUpdateAverageConversationsLength,
  dbDisplayAllMetrics
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

export const updateRegisteredUsers = (request, reply) => {
  dbUpdateRegisteredUsersData().then(reply);
};

// minh
export const displayRegisteredUsers = (request, reply) => {
  dbDisplayRegisteredUsersData().then(reply);
};

export const displayActiveUsers = (request, reply) => {
  dbDisplayActiveUsersData().then(reply);
};

export const updateActiveUsers = (request, reply) => {
  dbUpdateActiveUsersData().then(reply);
};

export const displayActiveConversation = (request, reply) => {
  dbDisplayActiveConversationData().then(reply);
};

export const updateActiveConversations = (request, reply) => {
  dbUpDateActiveConversationsData().then(reply);
};

export const displayConversationsLength = (request, reply) => {
  dbDisplayAverageConversationsLength().then(reply);
};

export const updateAverageConversationsLength = (request, reply) => {
  dbUpdateAverageConversationsLength().then(reply);
};

export const displayAllMetrics = (request, reply) =>
  dbDisplayAllMetrics().then(reply);

// insert active usercount everyday at 23:59
const cron = require('node-cron');
cron.schedule('0 0 * * *', function(){
  console.log(' START --------------------------0:00');
  //getCountActiveUsers();
  console.log(' END --------------------------');
});
