exports.up = knex => {
  knex('users').insert({
      active: true,
      email: 'friendshipapp@outlook.com',
      scope: 'admin',
      username: 'administrator',
      status: 'Activated',
    },
    'id',
  )
    .then(ids => ids[0])
    .then(ownerId =>
    knex('secrets').insert({
      ownerId,
      password: '$2y$12$3GR/1hgM8rlCczabnilYd.G6o8EgdlPEJupqkgIiYJHHghCj5sK3m',
    }));
};

exports.down = knex => knex.schema.dropTableIfExists('users').dropTableIfExists('secrets');
