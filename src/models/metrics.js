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

export const dbUserLastActive = userId => knex('users')
  .where({ id: userId })
  .update({ lastActive: moment() });


// export const dbUserCreatedAt = userId => knex('users')
//   .where({ id: userId })
//   .update({ createdAt: moment() });

// minh - created data model for each registered user row
export const dbGetRegisteredUser = id =>
  knex('metrics_users_registered')
    .first()
    .where({ id });

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

// minh - display active conversation counts by date
export const dbDisplayActiveConversationData = async () => {
  const collectLastMessagesByDate = await knex('messages')
    .debug(false)
    .select(knex.raw(`Date(messages."chat_time") as timestamp, count('chatroom_id') as conversations_count`))
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  const collectMetricsActiveConversations = await knex('metrics_active_conversations')
    .debug(false)
    .select('*');

  if (collectMetricsActiveConversations.length === 0) {
    await collectLastMessagesByDate.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_active_conversations')
          .debug(false)
          .insert({
            conversations_count: element.conversations_count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_active_conversations').select('*').orderBy('timestamp', 'desc');
};

// minh - logic to update/ insert data row in metrics_active_conversations
export const dbUpDateActiveConversationsData = async () => {
  const existingData = await dbDisplayActiveConversationData();

  const dayActiveConversations = await knex('messages')
    .debug(false)
    .count('*')
    .where(knex.raw('??::date = ?', ['chat_time', moment().startOf('day')]));

  if (moment(existingData[0].timestamp).startOf('day').isSame(moment().startOf('day'))) {
    await knex.transaction(trx =>
      trx('metrics_active_conversations')
        .debug(false)
        .update({ conversations_count: dayActiveConversations[0].count })
        .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')])),
    );
  } else {
    await knex.transaction(trx =>
      trx('metrics_active_conversations')
        .debug(false)
        .insert({
          conversations_count: dayActiveConversations[0].count,
          timestamp: moment().startOf('day'),
        }),
    );
  }

  return knex('metrics_active_conversations')
          .select('*')
          .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};
