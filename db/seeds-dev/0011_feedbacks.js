const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');
import knex from '../../src/utils/db';
// there are two type of feedback options
const feedbackFields = [
  {
    createdAt: moment(),
    suggestion: faker.lorem.sentences,
    given_by: () => faker.random.number({ min: 1, max: 150 }),
    rating: () => faker.random.number({ min: 1, max: 30 }),
    goalRate: () => faker.random.number({ min: 1, max: 30 }),
    OtherReason: faker.lorem.sentences
  },
  {
    createdAt: moment(),
    given_by: () => faker.random.number({ min: 1, max: 150 }),
    rating: () => faker.random.number({ min: 1, max: 30 }),
    goalRate: () => faker.random.number({ min: 1, max: 30 }),
    findFriendEasy: faker.lorem.sentences,
    findFriendHard: faker.lorem.sentences,
    suggestImprovement: faker.lorem.sentences
  }
];

const feedback_surveyOption = {
  feedbackId: () => count++,
  optionId: () => faker.random.arrayElement([1, 2, 3, 4, 5])
};

exports.seed = knex => {
  return knex
    .batchInsert(
      'feedbacks',
      simpleFixtures.generateFixtures(feedbackFields[0], 20)
    )
    .then(() =>
      knex.batchInsert(
        'feedbacks',
        simpleFixtures.generateFixtures(feedbackFields[1], 20)
      )
    )
    .then(() => {
      let optionsArr = [];
      for (let count = 1; count < 40; count++) {
        optionsArr.push(
          { feedbackId: count, optionId: 1 },
          { feedbackId: count, optionId: 2 },
          { feedbackId: count, optionId: 3 },
          { feedbackId: count, optionId: 4 },
          { feedbackId: count, optionId: 5 }
        );
      }
      knex.batchInsert('feedback_surveyOption', optionsArr);
    });
};
