import knex from '../utils/db';

const registeredUsersFields = ['id', 'users_count', 'timestamp'];

const countActiveUsersFields = ['id', 'users_count', 'timestamp'];

export const dbGetNbMatchesMessaging = () => {
  return -1;
};

export const dbGetNbMessagesByConversation = () => {
  return -1;
};

export const dbGetNbMessages = () => {
  return -1;
};


export const dbUserLastActive = userId => knex('users')
    .where({ id: userId })
    .update({ lastActive: new Date() });

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
      .then(results => results[0]);

    return registeredUser;
  });

// count lastActive from users table, insert the result into metrics_active_users.users_count
export const dbCreateActiveUsersCount = () => {
  const lastActiveUsers = knex('users')
    .count('lastActive');

  knex.transaction(async (trx) => {
    const activeUsersList = await trx('metrics_active_users')
      .insert({ users_count: lastActiveUsers })
      .returning('*')
      .then(results => results[0]);

    return activeUsersList;
  });

  return lastActiveUsers;
};

export const dbGetNbActiveUsers = () =>
  knex('metrics_active_users')
    .select(countActiveUsersFields);

export const dbGetActiveUsersCount = id =>
  knex('metrics_active_users')
    .first()
    .where({ id });

