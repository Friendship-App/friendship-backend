const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const tagFields = {
  name: () => faker.company.catchPhraseNoun(),
  category: () => faker.random.number({ min: 1, max: 2 }),
  createdAt: moment(),
};

exports.seed = knex =>
  knex
    .batchInsert('tags', simpleFixtures.generateFixtures(tagFields, 10))
    );
