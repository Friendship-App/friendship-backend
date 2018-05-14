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

let userId = 1;
let tagId = 0;

const usertagFields = {
  userId: () => {
    if (tagId === 10) {
      userId += 1;
      tagId = 0;
    }
    return userId;
  },
  tagId: () => {
    tagId += 1;
    return tagId;
  },
  love: () => faker.random.number({min: 0, max: 1}),
};

exports.seed = knex =>
  knex.batchInsert(
    'tags',
    activitiesTags
  )
    .then(() => knex.batchInsert('tags', interestsTags))
    .then(() =>
      knex.batchInsert(
        'user_tag',
        simpleFixtures.generateFixtures(usertagFields, 100),
      ),
    );
