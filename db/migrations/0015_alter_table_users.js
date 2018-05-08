exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.string('image').defaultTo('https://friendship-app.s3.amazonaws.com/profile/default.jpg').alter()
  });

exports.down = knex => knex.schema.dropTableIfExists('users').dropTableIfExists('secrets');
