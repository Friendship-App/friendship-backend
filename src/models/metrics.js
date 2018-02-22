import moment from 'moment';
import knex from '../utils/db';

const registeredUsersFields = ['id', 'users_count', 'timestamp'];

const activeUsersFields = ['id', 'users_count', 'timestamp'];

export const dbGetNbMatchesMessaging = () => {
  return -1;
};

export const dbGetNbMessagesByConversation = () => {
  return -1;
};

export const dbGetNbMessages = () => {
  return -1;
};

<<<<<<< HEAD
export const dbGetNbActiveUsers = () => 
  knex.raw(`SELECT metrics_users_registered.timestamp,count(users."lastActive") as lastActive FROM metrics_users_registered LEFT JOIN users ON (Date(metrics_users_registered.timestamp)=Date(users."lastActive"))GROUP BY (metrics_users_registered.timestamp) ORDER BY metrics_users_registered.timestamp ASC`)
  .then(res=>res.rows)

export const dbGetRegisteredUsers = () =>
  knex.raw(`SELECT metrics_users_registered.timestamp,count(users."createdAt") as registered FROM metrics_users_registered LEFT JOIN users ON (Date(metrics_users_registered.timestamp)=Date(users."createdAt"))GROUP BY (metrics_users_registered.timestamp) ORDER BY metrics_users_registered.timestamp ASC`)
  .then(res=>res.rows)
=======

export const dbUserLastActive = userId => knex('users')
  .where({ id: userId })
  .update({ lastActive: new Date() });


// export const dbUserCreatedAt = userId => knex('users')
//   .where({ id: userId })
//   .update({ createdAt: moment() });

// minh - created data model for each registered user row
export const dbGetRegisteredUser = id =>
  knex('metrics_users_registered')
    .first()
    .where({ id });
>>>>>>> c7efdc1cf3ea2a3a1a0b75bf92458f280ba94535

// minh - display registered users data on front-end with some logic
// 1. collect createdAt data from users table
// 2. collect data from metrics_users_registered table
// 3. check if metrics_users_registered table is empty
// 4. insert collected data from users table if empty, otherwise do nothing
// 5. return metrics_users_registered table to front-end.

export const dbDisplayRegisteredUsersData = async () => {
  const collectUsersCreatedAt = await knex('users')
    .debug(false)
    .select(knex.raw(`count('*') as users_count, Date(users."createdAt") as timestamp`))
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  const collectMetricsUsersRegistered = await knex('metrics_users_registered')
    .debug(false)
    .select(registeredUsersFields);

  if (collectMetricsUsersRegistered.length === 0) {
    await collectUsersCreatedAt.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_users_registered')
          .debug(false)
          .insert({
            users_count: element.users_count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_users_registered').select(registeredUsersFields).orderBy('timestamp', 'desc');
};

// minh - logic to insert new row or update the row
export const dbUpdateRegisteredUsersData = async () => {
  const existingData = await dbDisplayRegisteredUsersData();

  const dayRegisteredUsers = await knex('users')
    .debug(false)
    .count('*')
    .where(knex.raw('??::date = ?', ['createdAt', moment().startOf('day')]));

  // check if there is a row with today's date in the table
  // if yes update the row, if no insert a new row

  if (moment(existingData[0].timestamp).startOf('day').isSame(moment().startOf('day'))) {
    await knex.transaction(trx =>
      trx('metrics_users_registered')
        .debug(false)
        .update({ users_count: dayRegisteredUsers[0].count })
        .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')])),
    );
  } else {
    await knex.transaction(trx =>
      trx('metrics_users_registered')
        .debug(false)
        .insert({
          users_count: dayRegisteredUsers[0].count,
          timestamp: moment().startOf('day'),
        }),
    );
  }
  return knex('metrics_users_registered')
          .select(registeredUsersFields)
          .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};

// minh - display last active users count on front-end
export const dbDisplayActiveUsersData = async () => {
  const collectUsersLastActive = await knex('users')
    .debug(false)
    .select(knex.raw(`count('*') as users_count, Date(users."lastActive") as timestamp`))
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  const collectMetricsActiveUsers = await knex('metrics_active_users')
    .debug(false)
    .select(activeUsersFields);

  if (collectMetricsActiveUsers.length === 0) {
    await collectUsersLastActive.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_active_users')
          .debug(false)
          .insert({
            users_count: element.users_count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_active_users').select(activeUsersFields).orderBy('timestamp', 'desc');
};

// count lastActive from users table
// insert or update the result into a row on metrics_active_users.users_count
export const dbUpdateActiveUsersData = async () => {
  const existingData = await dbDisplayActiveUsersData();

  const dayActiveUsers = await knex('users')
    .debug(false)
    .count('*')
    .where(knex.raw('??::date = ?', ['lastActive', moment().startOf('day')]));

  // check if there is a row with today's date in the table
  // if yes update the row, if no insert a new row

  if (moment(existingData[0].timestamp).startOf('day').isSame(moment().startOf('day'))) {
    await knex.transaction(trx =>
      trx('metrics_active_users')
        .debug(false)
        .update({ users_count: dayActiveUsers[0].count })
        .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')])),
    );
  } else {
    await knex.transaction(trx =>
      trx('metrics_users_registered')
        .debug(false)
        .insert({
          users_count: dayActiveUsers[0].count,
          timestamp: moment().startOf('day'),
        }),
    );
  }
  return knex('metrics_active_users')
          .select(activeUsersFields)
          .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};

