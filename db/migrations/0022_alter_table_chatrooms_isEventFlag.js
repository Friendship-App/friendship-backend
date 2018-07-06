exports.up = knex =>
  knex.schema.alterTable('chatrooms', (t) => {
    t.boolean('event').defaultTo(false)
  });

exports.down = knex => knex.schema.dropTableIfExists('events');
