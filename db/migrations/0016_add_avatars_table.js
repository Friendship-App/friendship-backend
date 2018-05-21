exports.up = knex =>
  knex.schema
    .createTableIfNotExists("avatars", table => {
      table.increments("id").primary();
      table.text("uri").notNullable();
    }).then(() =>
    knex('avatars').insert([
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar1.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar2.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar3.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar4.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar5.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar6.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar7.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar8.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar9.png'},
      {uri: 'https://s3.eu-west-2.amazonaws.com/friendshipapp/avatars/avatar10.png'},
    ])
  )
;

exports.down = knex =>
  knex.schema.table
    .dropTableIfExists("avatars");
