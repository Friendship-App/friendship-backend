exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.string('image').defaultTo('https://s3.eu-west-2.amazonaws.com/friendshipapp/profile/default.jpg').alter()
  });

exports.down = knex => knex.schema.dropTableIfExists('users').dropTableIfExists('secrets');
