import knex from '../utils/db';

const messageFields = ['id', 'text_message', 'chat_time', 'user_id', 'chatroom_id', 'read'];

export const dbGetMessages = () => knex('messages').select(messageFields).orderBy('id', 'asc');
// get all ms by a userId
export const dbGetMessage = user_id =>
knex('messages')
  .select()
  .where({ user_id });
export const dbCreateMessage = ({ ...fields }) =>
  knex('messages')
    .insert(fields)
    .returning('*')
    .then(results => results[0]); // return only first result
    
export const dbUpdateReadMessages = async  ( message_id_arr ) => {
  message_id_arr.forEach(async (message_id) => {
    console.log(message_id);
    let req = await knex('messages')
      .where({ id: message_id })
      .update({ read: true });
    return req;
  });
};
