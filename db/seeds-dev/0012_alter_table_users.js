exports.seed = knex => {
  return knex('users').update('image', 'https://s3.eu-west-2.amazonaws.com/friendshipapp/profile/default.jpg');
};
