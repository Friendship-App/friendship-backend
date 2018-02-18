import moment from 'moment';
import knex from '../utils/db';

// const registeredUsersFields = ['id', 'users_count', 'timestamp'];

// const countActiveUsersFields = ['id', 'users_count', 'timestamp'];

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


// export const dbUserCreatedAt = userId => knex('users')
//   .where({ id: userId })
//   .update({ createdAt: moment() });

export const dbGetNbRegisteredUsers = () =>
  knex.raw(`SELECT metrics_users_registered.timestamp,count(users."createdAt") as nbOfRegesiteredUsers FROM metrics_users_registered 
            LEFT JOIN users ON (Date(metrics_users_registered.timestamp)=Date(users."createdAt"))
            GROUP BY (metrics_users_registered.timestamp) 
            ORDER BY metrics_users_registered.timestamp ASC`)
  .then(res => res.rows);
  // knex('metrics_users_registered')
  //   .select(registeredUsersFields);

// minh - created data model for each registered user row
export const dbGetRegisteredUser = id =>
  knex('metrics_users_registered')
    .first()
    .where({ id });

export const dbCountRegisteredUsers = async () => {
  const nbRegisteredUsers = await knex('users')
    .debug(false)
    .count('*')
    .where(knex.raw('??::date = ?', ['createdAt', moment().startOf('day')]));

  return knex.transaction(trx =>
    trx('metrics_users_registered')
      .insert({ users_count: nbRegisteredUsers[0].count, timestamp: moment() })
      .returning('*')
      .then(results => results[0]),
  );
};

// count lastActive from users table
// insert the result into a row on metrics_active_users.users_count
export const dbCountActiveUsers = async () => {
  const lastActiveUsers = await knex('users')

    .debug(false)
    .count('lastActive')
    .where(knex.raw('??::date = ?', ['lastActive', moment().startOf('day')]));

  return knex.transaction(trx =>
    trx('metrics_active_users')
    // Remove debug for your function
      .debug(false)
      .insert({ users_count: lastActiveUsers[0].count, timestamp: moment() })
      .returning('*')
      .then(results => results[0]),
  );
};

// display contents of metrics_active_users table
export const dbGetNbActiveUsers = () =>
  knex.raw(`SELECT metrics_active_users.timestamp,count(users."lastActive") as lastActive FROM metrics_active_users
            LEFT JOIN users ON (Date(metrics_active_users.timestamp)=Date(users."lastActive"))
            GROUP BY (metrics_active_users.timestamp) 
            ORDER BY metrics_active_users.timestamp ASC`)
  .then(res => res.rows);
  // knex('metrics_active_users')
  // .select(countActiveUsersFields);
