exports.up = knex =>
  knex.schema
    .createTableIfNotExists("avatars", table => {
      table.increments("id").primary();
      table.text("uri").notNullable();
    }).then(() =>
    knex('avatars').insert([
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar1.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar2.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar3.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar4.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar5.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar6.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar7.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar8.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar9.png'},
      {uri: 'https://friendship-app.s3.amazonaws.com/avatars/avatar10.png'},
    ])
  )
;

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("avatars");
