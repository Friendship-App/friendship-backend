import { getDates } from '../../src/models/metrics';

const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');
const randomDates = getDates('2018-01-01', moment().startOf('day'));

const eventFields = {
  createdAt: () =>
    randomDates[Math.floor(Math.random() * randomDates.length)].timestamp,
  title: faker.lorem.word,
  description: faker.lorem.sentences,
  city: faker.address.city,
  address: faker.address.streetAddress,
  eventDate: () =>
    randomDates[Math.floor(Math.random() * randomDates.length)].timestamp,
};
exports.seed = knex =>
  knex.batchInsert('events', simpleFixtures.generateFixtures(eventFields, 8));
