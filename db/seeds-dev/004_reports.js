const simpleFixtures = require("simple-fixtures");
const faker = require("faker/locale/en");
const moment = require("moment");

const descriptionFields=[
  "I would like you to contact this user",
  "Report user for harassment or bullying",
  "Report user for sale or promotion of illegal substances",
  "Report user for nudity or pornograhy",
  "Report user for violence or harm",
  "Report user for hate speech or symbols",
  "Report user for intellectual property violation"
]

const reportFields = {
  userId: () => faker.random.number({ min: 1, max: 150 }),
  createdAt: moment(),
  description: ()=>faker.random.arrayElement(descriptionFields),
  reported_by: () => faker.random.number({ min: 1, max: 150 })
};

exports.seed = knex => {
  return knex.batchInsert(
    "reports",
    simpleFixtures.generateFixtures(reportFields, 100)
  );
};
