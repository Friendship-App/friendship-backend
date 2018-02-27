import moment from 'moment';
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
export const getDates = (startDate, endDate) => {
  const dates = [];
  const chosenDate = moment(startDate).startOf('day');
  while (chosenDate.isSameOrBefore(moment(endDate))) {
    dates.push({
      timestamp: moment(chosenDate),
      count: 0,
    });
    chosenDate.add(1, 'days');
  }
  return dates;
};

export const dbDisplayRegisteredUsersData = async () => {
  const comparingData = await getDates('2018-01-01', moment().startOf('day'));
  const data = [];

  const collectUsersCreatedAt = await knex('users')
    .debug(false)
    .select(knex.raw(`count('*') as users_count, Date(users."createdAt") as timestamp`))
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  await comparingData.forEach(async (element) => {
    await collectUsersCreatedAt.forEach((row) => {
      if (moment(element.timestamp).isSame(moment(row.timestamp))) {
        element.count = row.users_count;
      }
      return element.count;
    });
    data.push(element);
  });

  const collectMetricsUsersRegistered = await knex('metrics_users_registered')
    .debug(false)
    .select('*');

  if (collectMetricsUsersRegistered.length === 0) {
    await data.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_users_registered')
          .debug(false)
          .insert({
            users_count: element.count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_users_registered')
    .select('*')
    .limit(30)
    .orderBy('timestamp', 'desc');
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
          .select('*')
          .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};

// minh - display last active users count on front-end
export const dbDisplayActiveUsersData = async () => {
  const comparingData = await getDates('2018-01-01', moment().startOf('day'));
  const data = [];

  const collectUsersLastActive = await knex('users')
    .debug(false)
    .select(knex.raw(`count('*') as users_count, Date(users."lastActive") as timestamp`))
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  await comparingData.forEach(async (element) => {
    await collectUsersLastActive.forEach((row) => {
      if (moment(element.timestamp).isSame(moment(row.timestamp))) {
        element.count = row.users_count;
      }
      return element.count;
    });
    data.push(element);
  });

  const collectMetricsActiveUsers = await knex('metrics_active_users')
    .debug(false)
    .select('*');

  if (collectMetricsActiveUsers.length === 0) {
    await data.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_active_users')
          .debug(false)
          .insert({
            users_count: element.count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_active_users')
    .select('*')
    .limit(30)
    .orderBy('timestamp', 'desc');
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
          .select('*')
          .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};

// minh - display active conversation counts by date
export const dbDisplayActiveConversationData = async () => {
  const collectLastMessagesByDate = await knex('messages')
    .debug(false)
    .select(knex.raw(`Date(messages."chat_time") as timestamp, count(distinct messages."chatroom_id") as conversations_count`))
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
    .countDistinct('chat_id')
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

// minh - display average conversations length by date
export const dbDisplayAverageConversationsLength = async () => {
  await dbDisplayActiveConversationData();

  const joinChatroomMessagesByDate = await knex('metrics_active_conversations')
    .join('messages', knex.raw('??::date', ['timestamp']), knex.raw('??::date', ['messages.chat_time']))
    .select(knex.raw(`metrics_active_conversations."timestamp" as timestamp, 
                      metrics_active_conversations."conversations_count" as number_of_chatrooms, 
                      count(messages."id") as number_of_messages`))
    .groupBy('timestamp', 'number_of_chatrooms');


  const collectMetricsConversationsLength = await knex('metrics_conversations_length')
    .debug(false)
    .select('*');

  if (collectMetricsConversationsLength.length === 0) {
    await joinChatroomMessagesByDate.forEach(async (element) => {
      await knex.transaction(trx =>
        trx('metrics_conversations_length')
          .debug(false)
          .insert({
            conversations_length: +((element.number_of_messages / element.number_of_chatrooms).toFixed(2)),
            timestamp: element.timestamp,
          }),
      );
    });
  }
  return knex('metrics_conversations_length').select('*').orderBy('timestamp', 'desc');
};

// minh - logic to update or insert conversations length row
export const dbUpdateAverageConversationsLength = async () => {
  const existingData = await dbDisplayAverageConversationsLength();

  const dayStats = await knex('metrics_active_conversations')
    .join('messages', knex.raw('??::date', ['timestamp']), knex.raw('??::date', ['messages.chat_time']))
    .select(knex.raw(`metrics_active_conversations."timestamp" as timestamp, 
                      metrics_active_conversations."conversations_count" as number_of_chatrooms, 
                      count(messages."id") as number_of_messages`))
    .groupBy('timestamp', 'number_of_chatrooms')
    .where(knex.raw('??::date = ?', ['chat_time', moment().startOf('day')]));

  if (moment(existingData[0].timestamp).startOf('day').isSame(moment().startOf('day'))) {
    await knex.transaction(trx =>
      trx('metrics_conversations_length')
      .debug(false)
      .update({
        conversations_length: +(dayStats[0].number_of_messages / dayStats[0].number_of_chatrooms),
      })
      .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')])),
    );
  } else {
    await knex.transaction(trx =>
      trx('metrics_conversations_length')
        .debug(false)
        .insert({
          conversations_length: +(dayStats[0].number_of_messages / dayStats[0].number_of_chatrooms),
          timestamp: moment().startOf('day'),
        }),
    );
  }

  return knex('metrics_conversations_length')
              .select('*')
              .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};
