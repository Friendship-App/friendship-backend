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
  dbDisplayAllMetrics,
  dbDisplayWeekMetrics,
  dbDisplayMonthMetrics,
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

export const updateRegisteredUsers = (request, reply) => {
  dbUpdateRegisteredUsersData().then(reply);
};

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

export const displayWeekMetrics = (request, reply) =>
  dbDisplayWeekMetrics().then(reply);

export const displayMonthMetrics = (request, reply) =>
  dbDisplayMonthMetrics().then(reply);

// insert active usercount everyday at 23:59
const cron = require('node-cron');

// Cron job runs every minute so metrics are populated and there is smth to show on metrics
cron.schedule('1 * * * * *', async () => {
  console.log(' START Cron job -----------------1 min');
  try {
    await dbUpdateRegisteredUsersData();
    await dbUpdateActiveUsersData();
    await dbUpDateActiveConversationsData();
    await dbUpdateAverageConversationsLength();
  } catch (e) {
    console.log('error with Cron: ', e);
  }

  console.log(' END --------------------------');
});
