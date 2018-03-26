exports.up = knex =>
  knex.schema
    /**
     * Events table
     *
     * Contains info on all events in the system
     */
    .createTableIfNotExists('events', table => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('title');
      table.binary('eventImage');
      table.text('description');
      table.text('address');
      table
        .integer('hostId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table;
      table.text('city');
      table.text('minParticipants');
      table.text('maxParticipants');
      table.text('participantsMix');
      table.timestamp('eventDate');
    });
exports.down = knex => knex.schema.dropTableIfExists('events');
