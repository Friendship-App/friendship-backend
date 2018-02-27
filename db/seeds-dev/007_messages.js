import moment from 'moment';

const faker = require('faker/locale/en');
const momentRandom = require('moment-random');


exports.seed = knex =>
knex('messages')
  .then(() =>
    knex('chatrooms').select(),
  )
  .then((chatrooms) => {
    const messages = [];

    chatrooms.forEach(chatroom =>
      [...Array(faker.random.number(25))].forEach(() =>
        messages.push({
          text_message: faker.lorem.sentences(),
          chatroom_id: chatroom.id,
          user_id: (Math.random() < 0.5) ? chatroom.user_creator_id : chatroom.user_receiver_id,
          chat_time: momentRandom(moment(), '2018-01-01'),
        }),
      ),
    );

    return knex.batchInsert(
      'messages',
      messages,
    );
  });
