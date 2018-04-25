import {
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

export const testMetrics = async (request, reply) => {
  try {
    await dbUpdateRegisteredUsersData();
    await dbUpdateActiveUsersData();
    await dbUpDateActiveConversationsData();
    await dbUpdateAverageConversationsLength();
    reply('Test metrics successful');
  } catch (e) {
    reply(`Error: ${e}`);
  }
};
