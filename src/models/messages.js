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
export const dbUpdateReadMessages = ( message_id_arr ) => {
  console.log('This is message id array ' + message_id_arr.toString());
  console.log('THESE ARE THE MESSAGE ID: ');

  // console.log(message_id_arr[1]);
  // return  knex('messages')
  //     .where({ id: message_id_arr[1] })
  //     .update({ read: true });


  for(let message_id of message_id_arr) {
    console.log(message_id);
    return knex('messages')
      .where({ id: message_id })
      .update({ read: true });
      //.returning('*');
  }

};
