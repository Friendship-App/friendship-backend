const simpleFixtures = require('simple-fixtures');

// Designer decided to have a preset list
// Using this for the seed data as well
const personalities = [
  'relaxed',
  'ambitious',
  'traditional',
  'open-minded',
  'religion',
  'free thinker',
  'going out',
  'chilling out',
];
let index = 0;

const personalityFields = {
  name: () => personalities[index++],
};

exports.seed = knex =>
  knex.batchInsert(
    'personalities',
    simpleFixtures.generateFixtures(personalityFields, 8),
  );
