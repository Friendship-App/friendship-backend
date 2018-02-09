import knex from '../utils/db';

const registeredUsersFields = ['id', 'users_count', 'timestamp'];

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
    .select(registeredUsersFields);

// minh - created data model for each registered user row
export const dbGetRegisteredUser = id =>
  knex('metrics_users_registered')
    .first()
    .where({ id });

export const dbCreateRegisteredUser = ({ ...fields }) =>
  knex.transaction(async (trx) => {
    const registeredUser = await trx('metrics_users_registered')
      .insert(fields)
      .returning('*')
      .then(results => results);

    return registeredUser;
  });

export const dbUserLastActive = userId =>
  knex('users')
  .where({ id: userId })
    .update({ lastActive: new Date() });

