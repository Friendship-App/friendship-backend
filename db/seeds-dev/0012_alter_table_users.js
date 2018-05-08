exports.seed = knex => {
  return knex('users').update('image', 'https://friendship-app.s3.amazonaws.com/profile/default.jpg');
};
