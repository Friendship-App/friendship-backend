import { getDates } from '../../src/models/metrics';

const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');
const randomDates = getDates('2018-03-20', moment().startOf('day'));

let userId = 1;
let eventId = 0;
let index = 0;

const eventFields = {
  createdAt: () =>
    randomDates[Math.floor(Math.random() * randomDates.length)].timestamp,
  title: faker.lorem.word,
  description: faker.lorem.sentences,
  city: faker.address.city,
  participantsMix: 60,
  address: faker.address.streetAddress,
  hostId: 4,
  eventDate: () =>
    randomDates[Math.floor(Math.random() * randomDates.length)].timestamp,
};

exports.seed = knex =>
  knex
    .batchInsert('events', simpleFixtures.generateFixtures(eventFields, 8))
    .returning('id')
    .then(function(id) {
      for (let i = 0; i < id.length; i++) {
        knex.insert('eventParticipants', {
          userId: 4,
          eventId: id[i],
          createdAt: moment(),
        });
      }
    });
