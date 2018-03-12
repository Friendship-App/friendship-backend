import moment from 'moment';
import knex from '../utils/db';

export const dbUserLastActive = userId =>
  knex('users')
    .where({ id: userId })
    .update({ lastActive: moment() });

// minh - created data model for each registered user row
export const dbGetRegisteredUser = id =>
  knex('metrics_users_registered')
    .first()
    .where({ id });

// minh - display emtrics data on front-end with some logic
// 1. collect data from users table
// 2. create an array of dates from desired startDate to now
// 3. collect data from metrics table
// 4. compare dates from metrics table with the array
// 5. update counts/average on date array where matched
// 6. check if metrics table is empty
// 7. insert updated data from date array if empty, otherwise do nothing
// 8. return latest 30 rows on metrics table to front-end.

// method to create array of dates between start and end
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

// count registered users by date
export const dbDisplayRegisteredUsersData = async () => {
  // generate date arrays
  const comparingData = await getDates('2018-01-01', moment().startOf('day'));
  // empty array to hold data to be inserted, updated
  const data = [];

  // collect data from users table
  const collectUsersCreatedAt = await knex('users')
    .debug(false)
    .select(
      knex.raw(
        'count(\'*\') as users_count, Date(users."createdAt") as timestamp',
      ),
    )
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  // compare to date array
  await comparingData.forEach(async element => {
    await collectUsersCreatedAt.forEach(row => {
      if (moment(element.timestamp).isSame(moment(row.timestamp))) {
        // update the count on matched dates
        element.count = row.users_count;
      }
      return element.count;
    });
    // populate data array
    data.push(element);
  });

  // check metrics table to do the inserts
  const collectMetricsUsersRegistered = await knex('metrics_users_registered')
    .debug(false)
    .select('*');

  if (collectMetricsUsersRegistered.length === 0) {
    await data.forEach(async element => {
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

  if (
    moment(existingData[0].timestamp)
      .startOf('day')
      .isSame(moment().startOf('day'))
  ) {
    await knex.transaction(trx =>
      trx('metrics_users_registered')
        .debug(false)
        .update({ users_count: dayRegisteredUsers[0].count })
        .where(
          knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]),
        ),
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
    .select(
      knex.raw(
        'count(\'*\') as users_count, Date(users."lastActive") as timestamp',
      ),
    )
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  await comparingData.forEach(async element => {
    await collectUsersLastActive.forEach(row => {
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
    await data.forEach(async element => {
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

  if (
    moment(existingData[0].timestamp)
      .startOf('day')
      .isSame(moment().startOf('day'))
  ) {
    await knex.transaction(trx =>
      trx('metrics_active_users')
        .debug(false)
        .update({ users_count: dayActiveUsers[0].count })
        .where(
          knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]),
        ),
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
  const comparingData = await getDates('2018-01-01', moment().startOf('day'));
  const data = [];

  const collectLastMessagesByDate = await knex('messages')
    .debug(false)
    .select(
      knex.raw(
        'Date(messages."chat_time") as timestamp, count(distinct messages."chatroom_id") as conversations_count',
      ),
    )
    .groupBy('timestamp')
    .orderBy('timestamp', 'asc');

  await comparingData.forEach(async element => {
    await collectLastMessagesByDate.forEach(row => {
      if (moment(element.timestamp).isSame(moment(row.timestamp))) {
        element.count = row.conversations_count;
      }
      return element.count;
    });
    data.push(element);
  });

  const collectMetricsActiveConversations = await knex(
    'metrics_active_conversations',
  )
    .debug(false)
    .select('*');

  if (collectMetricsActiveConversations.length === 0) {
    await data.forEach(async element => {
      await knex.transaction(trx =>
        trx('metrics_active_conversations')
          .debug(false)
          .insert({
            conversations_count: element.count,
            timestamp: element.timestamp,
          })
          .returning('*')
          .then(results => results[0]),
      );
    });
  }
  return knex('metrics_active_conversations')
    .select('*')
    .limit(30)
    .orderBy('timestamp', 'desc');
};

// minh - logic to update/ insert data row in metrics_active_conversations
export const dbUpDateActiveConversationsData = async () => {
  const existingData = await dbDisplayActiveConversationData();

  const dayActiveConversations = await knex('messages')
    .debug(false)
    .countDistinct('chatroom_id')
    .where(knex.raw('??::date = ?', ['chat_time', moment().startOf('day')]));

  if (
    moment(existingData[0].timestamp)
      .startOf('day')
      .isSame(moment().startOf('day'))
  ) {
    await knex.transaction(trx =>
      trx('metrics_active_conversations')
        .debug(false)
        .update({ conversations_count: dayActiveConversations[0].count })
        .where(
          knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]),
        ),
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
  const comparingData = await getDates('2018-01-01', moment().startOf('day'));
  const data = [];

  await dbDisplayActiveConversationData();

  const joinChatroomMessagesByDate = await knex('metrics_active_conversations')
    .join(
      'messages',
      knex.raw('??::date', ['timestamp']),
      knex.raw('??::date', ['messages.chat_time']),
    )
    .select(
      knex.raw(`metrics_active_conversations."timestamp" as timestamp, 
                      metrics_active_conversations."conversations_count" as number_of_chatrooms, 
                      count(messages."id") as number_of_messages`),
    )
    .groupBy('timestamp', 'number_of_chatrooms');

  await comparingData.forEach(async element => {
    await joinChatroomMessagesByDate.forEach(row => {
      if (moment(element.timestamp).isSame(moment(row.timestamp))) {
        element.count = row.number_of_chatrooms;
        element.messages_count = row.number_of_messages;
      }
      return element;
    });
    data.push(element);
  });

  const collectMetricsConversationsLength = await knex(
    'metrics_conversations_length',
  )
    .debug(false)
    .select('*');

  if (collectMetricsConversationsLength.length === 0) {
    await data.forEach(async element => {
      const avgLength = element.messages_count / element.count;
      Number.isNaN(avgLength)
        ? await knex.transaction(trx =>
            trx('metrics_conversations_length')
              .debug(false)
              .insert({
                conversations_length: 0,
                timestamp: element.timestamp,
              }),
          )
        : await knex.transaction(trx =>
            trx('metrics_conversations_length')
              .debug(false)
              .insert({
                conversations_length: avgLength.toFixed(2),
                timestamp: element.timestamp,
              }),
          );
    });
  }
  return knex('metrics_conversations_length')
    .select('*')
    .limit(30)
    .orderBy('timestamp', 'desc');
};

// minh - logic to update or insert conversations length row
export const dbUpdateAverageConversationsLength = async () => {
  const existingData = await dbDisplayAverageConversationsLength();

  const dayStats = await knex('metrics_active_conversations')
    .join(
      'messages',
      knex.raw('??::date', ['timestamp']),
      knex.raw('??::date', ['messages.chat_time']),
    )
    .select(
      knex.raw(`metrics_active_conversations."timestamp" as timestamp, 
                      metrics_active_conversations."conversations_count" as number_of_chatrooms, 
                      count(messages."id") as number_of_messages`),
    )
    .groupBy('timestamp', 'number_of_chatrooms')
    .where(knex.raw('??::date = ?', ['chat_time', moment().startOf('day')]));

  const avgLength =
    dayStats[0].number_of_messages / dayStats[0].number_of_chatrooms;

  if (
    moment(existingData[0].timestamp)
      .startOf('day')
      .isSame(moment().startOf('day'))
  ) {
    Number.isNaN(avgLength)
      ? await knex.transaction(trx =>
          trx('metrics_conversations_length')
            .debug(false)
            .update({
              conversations_length: 0,
            })
            .where(
              knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]),
            ),
        )
      : await knex.transaction(trx =>
          trx('metrics_conversations_length')
            .debug(false)
            .update({
              conversations_length: avgLength.toFixed(2),
            })
            .where(
              knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]),
            ),
        );
  } else {
    Number.isNaN(avgLength)
      ? await knex.transaction(trx =>
          trx('metrics_conversations_length')
            .debug(false)
            .insert({
              conversations_length: 0,
              timestamp: moment().startOf('day'),
            }),
        )
      : await knex.transaction(trx =>
          trx('metrics_conversations_length')
            .debug(false)
            .insert({
              conversations_length: avgLength.toFixed(2),
              timestamp: moment().startOf('day'),
            }),
        );
  }

  return knex('metrics_conversations_length')
    .select('*')
    .where(knex.raw('??::date = ?', ['timestamp', moment().startOf('day')]));
};

// metrics by week, month, whole history
export const dbDisplayAllMetrics = () =>
  knex('metrics_users_registered')
    .join(
      'metrics_active_users',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_conversations.timestamp']),
    )
    .join(
      'metrics_conversations_length',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_conversations_length.timestamp']),
    )
    .select(
      knex.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc');

export const dbDisplayWeekMetrics = () =>
  knex('metrics_users_registered')
    .join(
      'metrics_active_users',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_conversations.timestamp']),
    )
    .join(
      'metrics_conversations_length',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_conversations_length.timestamp']),
    )
    .select(
      knex.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .limit(7)
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc');

export const dbDisplayMonthMetrics = () =>
  knex('metrics_users_registered')
    .join(
      'metrics_active_users',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_active_conversations.timestamp']),
    )
    .join(
      'metrics_conversations_length',
      knex.raw('??::date', ['metrics_users_registered.timestamp']),
      knex.raw('??::date', ['metrics_conversations_length.timestamp']),
    )
    .select(
      knex.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .limit(30)
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc');
