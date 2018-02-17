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

export const dbGetNbActiveUsers = () => 
  knex.raw(`SELECT metrics_users_registered.timestamp,count(users."lastActive") as lastActive FROM metrics_users_registered LEFT JOIN users ON (Date(metrics_users_registered.timestamp)=Date(users."lastActive"))GROUP BY (metrics_users_registered.timestamp) ORDER BY metrics_users_registered.timestamp ASC`)
  .then(res=>res.rows)

export const dbGetRegisteredUsers = () =>
  knex.raw(`SELECT metrics_users_registered.timestamp,count(users."createdAt") as registered FROM metrics_users_registered LEFT JOIN users ON (Date(metrics_users_registered.timestamp)=Date(users."createdAt"))GROUP BY (metrics_users_registered.timestamp) ORDER BY metrics_users_registered.timestamp ASC`)
  .then(res=>res.rows)

export const dbUserLastActive = userId =>
  knex('users')
  .where({ id: userId })
    .update({ lastActive: new Date() });

