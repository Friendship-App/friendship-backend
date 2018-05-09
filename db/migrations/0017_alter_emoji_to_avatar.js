exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.dropColumn('emoji');
    t.string('avatar').defaultTo('https://friendship-app.s3.amazonaws.com/profile/default.jpg')
  }).then(() => knex('users').update('avatar', 'https://s3.eu-central-1.amazonaws.com/friendship-app/avatars/avatar1.png'));

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("avatars");
