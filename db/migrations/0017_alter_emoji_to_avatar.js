exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.dropColumn('emoji');
    t.string('avatar').defaultTo('https://friendship-app.s3.amazonaws.com/avatars/avatar1.png')
  }).then(() => knex('users').update('avatar', 'https://friendship-app.s3.amazonaws.com/avatars/avatar1.png'));

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("avatars");
