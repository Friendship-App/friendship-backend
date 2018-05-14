const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const activities = [
  'Eating well',
  'Doing fitness stuff',
  'Netflix & chill',
  'Coffee & discussing',
  'Backpacking',
  'Playing video games'
];

const interests = [
  'Rap-music',
  'Incorrect jokes/Memes',
  'Art galleries',
  'Cats & Dogs',
  'Spirituality',
  'Vegetarian food'
];

const activitiesTags = [];

activities.map((activity) => {
  activitiesTags.push({
    name: activity,
    category: 1,
    createdAt: moment()
  })
});

const interestsTags = [];

interests.map((interest) => {
  interestsTags.push({
    name: interest,
    category: 2,
    createdAt: moment()
  })
});


exports.seed = knex =>
  knex.batchInsert('tags', activitiesTags).then(() => knex.batchInsert('tags', interestsTags));
