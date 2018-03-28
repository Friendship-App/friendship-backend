exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('surveyOptions').del()
    .then(function () {
      // Inserts seed entries
      return knex('surveyOptions').insert([
        {option: 'Make one good friend'},
        {option: 'Find a friend group'},
        {option: 'Find fun events'},
        {option: 'Find friends to do specific activities with'},
        {option: 'Other:'},
      ]);
    });
};
