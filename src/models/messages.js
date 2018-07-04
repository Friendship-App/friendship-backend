import knex from '../utils/db';

const messageFields = [
  'id',
  'text_message',
  'chat_time',
  'user_id',
  'chatroom_id',
  'read',
];

// select all the messages
export const dbGetMessages = () =>
  knex('messages')
    .select(messageFields)
    .orderBy('id', 'asc');

// select all the message for a user
export const dbGetMessage = userId =>
  knex('messages')
    .select()
    .where({ userId });

// insert a new message
export const dbCreateMessage = ({ ...fields }) =>
  knex('messages')
    .insert(fields)
    .returning('*')
    .then(results => results[0]);

// change the read status of multiple messages
export const dbUpdateReadMessages = (data) =>
  knex('messages')
    .where({user_id: data.userId, chatroom_id: data.chatroomId})
    .update({read: true});
