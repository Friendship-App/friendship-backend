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
    .select()

// Work on the query
// Get date from timestamp
// Update the date
    export const dbGetMetrics=()=>{
  knex('metrics_users_registered').leftJoin('users','users.timestamp','metrics_users_registered.timestamp').select().count('users.active').groupBy('metrics_users_registered.timestamp').orderBy('metrics_users_registered.timestamp','asc')
}

export const dbUserLastActive = userId =>
  knex('users')
  .where({ id: userId })
    .update({ lastActive: new Date() });

