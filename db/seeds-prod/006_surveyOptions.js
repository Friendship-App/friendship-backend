const simpleFixtures = require("simple-fixtures");

const options = [
  "Make one good friend",
  "Find a friend group",
  "Find fun events",
  "Find friends to do specific activities with",
  "Other:"
];
let count = -1;

const optionFields = {
  option: () => {
    count += 1;
    return options[count];
  }
};

exports.seed = knex =>
  knex.batchInsert(
    "surveyOptions",
    simpleFixtures.generateFixtures(optionFields, options)
  );
