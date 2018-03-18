/**
 * Add table for feedbacks
 * And link it to a user
 */
exports.up = knex =>
knex.schema
  .createTableIfNotExists('feedbacks', (table) => {
    table.increments('id').primary();
    table.integer('given_by').references('id').inTable('users').onDelete('SET NULL');
    table.text('suggestion');
    table.text('findFriendEasy');
    table.text('findFriendHard');
    table.text('suggestImprovement');
    table.text('OtherReason');
    table.integer('rating');
    table.integer('goalRate');
    table.timestamp('createdAt').notNullable();
  });


exports.down = knex =>
knex.schema
  .table.dropTableIfExists('feedbacks');
