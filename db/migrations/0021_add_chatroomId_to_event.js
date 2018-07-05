exports.up = knex =>
  knex.schema.alterTable('events', (t) => {
    t.integer('chatroomId')
  });

exports.down = knex => knex.schema.dropTableIfExists('events');
