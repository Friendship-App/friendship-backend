const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const registeredUsersFields = {
  users_count: faker.random.number({ min: 1, max: 10 }),
  timestamp: moment(),
};

exports.seed = knex =>
  knex.batchInsert(
    'metrics_users_registered',
    simpleFixtures.generateFixtures(registeredUsersFields, 10),
  );

