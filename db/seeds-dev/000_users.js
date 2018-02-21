const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const emojis = ['👀', '💋', '🐶', '🦋', '😹', '😘', '🤡', '😈', '🤠', '👻'];

const compatibilities = ['54 %', '46 %', '23 %', '98 %', '98 %', '21 %', '76 %'];

const randomDates = ['2017-04-17', '2018-01-15', '2017-10-02', '2018-02-12', '2017-08-08', '2018-02-16', '2018-02-20'];
const randomDatesActive = ['2017-04-17', '2018-01-15', '2017-10-02', '2018-02-12', '2017-08-08', '2018-02-16', '2018-02-20', moment()];

const userFields = {
  createdAt: () => randomDates[Math.floor(Math.random() * randomDates.length)],
  lastActive: () => randomDatesActive[Math.floor(Math.random() * randomDatesActive.length)],
  email: faker.internet.email,
  description: faker.lorem.sentences,
  active: true,
  username: faker.internet.userName,
  emoji: () => emojis[Math.floor(Math.random() * emojis.length)],
  compatibility: () => compatibilities[Math.floor(Math.random() * compatibilities.length)],
  birthyear: () => faker.random.number({ min: 1950, max: 2000 }),
  scope: 'user',
  status: 'Activated',
};

// 'foobar'
const dummyPassword =
  '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

exports.seed = knex =>
  knex('users')
    // Generate one test admin user
    .insert({
      ...simpleFixtures.generateFixture(userFields),
      active: true,
      email: 'foo@bar.com',
      scope: 'admin',
    },
      'id',
    )
    .then(ids => ids[0]) // Return first (only) user id
    // Set admin user password to 'foobar'
    .then(ownerId =>
      knex('secrets').insert({
        ownerId,
        password: dummyPassword,
      }),
    )
    // Generate several test users (no password = login disabled)
    .then(() =>
      knex.batchInsert(
        'users',
        simpleFixtures.generateFixtures(userFields, 50),
      ),
    );
