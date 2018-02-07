import knex from '../utils/db';

export const dbGetNbMatchesMessaging = () => {
  return -1;
};

export const dbGetNbMessagesByConversation = () => {
  return -1;
};

export const dbGetNbMessages = () => {
  return -1;
};

export const dbGetNbActiveUsers = () => {
  return -1;
};

export const dbGetRegisteredUsers = () =>
  knex('metrics_users_registered')
    .select('id');

export const dbUserLastActive = userId =>
  knex('users')
  .where({ id: userId })
    .update({ lastActive: new Date() });

