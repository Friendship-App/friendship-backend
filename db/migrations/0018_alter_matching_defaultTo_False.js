exports.up = knex =>
  knex.schema.alterTable('users', (t) => {
    t.boolean('enableMatching').defaultTo(false).alter()
  });

exports.down = knex => knex.schema.dropTableIfExists('users').dropTableIfExists('secrets');
