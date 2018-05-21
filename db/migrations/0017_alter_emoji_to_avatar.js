exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.dropColumn('emoji');
    t.string('avatar').defaultTo('https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar1.png')
  }).then(() => knex('users').update('avatar', 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar1.png'));

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("avatars");
