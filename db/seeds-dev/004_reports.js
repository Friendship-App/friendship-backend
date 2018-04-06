const simpleFixtures = require("simple-fixtures");
const faker = require("faker/locale/en");
const moment = require("moment");

const feedbackFields = {
  createdAt: moment(),
  suggestion: faker.lorem.sentences,
  given_by: () => faker.random.number({ min: 1, max: 150 }),
  rating: () => faker.random.number({ min: 1, max: 30 }),
  goalRate: () => faker.random.number({ min: 1, max: 30 })
};

exports.seed = knex =>
  knex.batchInsert(
    "feedbacks",
    simpleFixtures.generateFixtures(feedbackFields, 100)
  );
