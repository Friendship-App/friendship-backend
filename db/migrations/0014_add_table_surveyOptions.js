exports.up = knex =>
  knex.schema
    .createTableIfNotExists("surveyOptions", table => {
      table.increments("id").primary();
      table.text("option").notNullable();
    })
    .createTableIfNotExists("feedback_surveyOption", table => {
      table
        .integer("feedbackId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("feedbacks")
        .onDelete("CASCADE");
      table
        .integer("optionId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("surveyOptions")
        .onDelete("CASCADE");
      table.primary(["feedbackId", "optionId"]);
    });

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("surveyOptions")
    .table.dropTableIfExists("feedback_surveyOption");
