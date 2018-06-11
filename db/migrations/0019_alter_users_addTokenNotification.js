exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.string('notificationToken')
  });

exports.down = knex => knex.schema.dropTableIfExists('users').dropTableIfExists('secrets');
