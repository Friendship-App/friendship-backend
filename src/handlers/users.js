import Boom from 'boom';

import { resizeImage } from '../utils/image';
import { createToken, hashPassword } from '../utils/auth';
import {
  dbGetUsers,
  dbGetUsersBatch,
  dbGetUser,
  dbDelUser,
  dbBanUser,
  dbFetchUserBan,
  dbUpdateUser,
  dbCreateUser,
  dbGetEmailVerification,
  dbDelVerificationHash,
  dbGetUserByUsername,
  dbUpdatePassword,
  dbGetFilteredUsers,
  dbGet30DaysUsers,
} from '../models/users';
import moment from 'moment';

export const getUsers = (request, reply) => {
  if (request.query.filter) {
    return dbGetFilteredUsers(request.query.filter).then(reply);
  }
  return dbGetUsers().then(reply);
};

export const get30DaysUsers = (request, reply) => {
  return dbGet30DaysUsers()
    .then(reply);
};
export const getUsersBatch = (request, reply) =>
  dbGetUsersBatch(request.params.pageNumber, request.pre.user.id).then(reply);

export const getUser = (request, reply) => {
  const user = dbGetUser(request.params.userId, request.pre.user.id);

  if (user.isbanned === '1') {
    user.isBanned = true;
    user.ban = dbFetchUserBan(user.id);
  }

  return reply(user);
};

export const getUserByUsername = (request, reply) =>
  dbGetUserByUsername(request.params.username, request.pre.user.id).then(reply);

export const delUser = (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Unprivileged users can only delete own userId!'));
  }

  return dbDelUser(request.params.userId).then(reply);
};

export const updateUser = async (request, reply) => {
  // console.log('Pre', request.pre.user.id);
  // console.log('params', request.params.userId);
  // console.log(request.pre.user.id === parseInt(request.params.userId, 10));
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== parseInt(request.params.userId, 10)
  ) {
    return reply(Boom.unauthorized('Unprivileged users can only perform updates on own userId!'));
  }

  const fields = {};

  for (const field in request.payload) {
    fields[field] = request.payload[field];
  }

  // Only admins are allowed to modify user scope
  if (request.pre.user.scope === 'admin' && request.payload.scope) {
    fields.scope = request.payload.scope;
  }

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.image) {
    const buf = Buffer.from(fields.image, 'base64');
    await resizeImage(buf).then(resized => (fields.image = resized));
  }
  console.log(fields.password);
  if (fields.password) {
    hashPassword(fields.password).then((hashedPassword) => {
      console.log(hashedPassword);
      dbUpdatePassword(request.pre.user.id, hashedPassword).catch((err) => {
        console.log(err);
      });
    });

    delete fields.password;
  }
  return dbUpdateUser(request.params.userId, fields).then(reply);
};

export const banUser = (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized("You don't have the permissions to do this action"));
  }

  const fields = {
    user_id: request.payload.userId,
    banned_by: request.pre.user.id,
    reason: request.payload.reason,
    expire:
      !request.payload.expire || request.payload.expire === 'x'
        ? null
        : moment()
          .add(request.payload.expire.split(':')[0], request.payload.expire.split(':')[1])
          .utc()
          .toISOString(),
  };

  return dbFetchUserBan(request.params.userId).then((result) => {
    if (result.length) return reply(Boom.conflict('User is already banned'));

    return dbBanUser(request.params.userId, fields).then(reply);
  });
};

export const authUser = (request, reply) =>
  reply(
    createToken({
      id: request.pre.user.id,
      email: request.pre.user.email,
      scope: request.pre.user.scope,
    }),
  );

export const registerUser = async (request, reply) => {
  const fields = {};

  // request.payload.forEach((field) => { fields[field] = request.payload[field]; });

  for (const field in request.payload) {
    fields[field] = request.payload[field];
  }

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.image) {
    const buf = Buffer.from(fields.image, 'base64');
    await resizeImage(buf).then(resized => (fields.image = resized));
  }

  console.log(fields);

  return hashPassword(request.payload.password)
    .then(passwordHash =>
      dbCreateUser({
        ...fields,
        email: request.payload.email.toLowerCase().trim(),
        password: passwordHash,
        scope: 'user',
      }).then((userData) => {
        reply(
          createToken({
            id: userData.id,
            email: userData.email,
            scope: userData.scope,
          }),
        );
      }),
  )
    .catch((err) => {
      if (err.constraint === 'users_email_unique') {
        reply(Boom.conflict('Email already exists'));
      } else if (err.constraint === 'users_username_unique') {
        reply(Boom.conflict('Username already exists'));
      } else {
        reply(Boom.badImplementation(err));
      }
    });
};

// check if the hash value exists in the db
// and verify the user that matches (active=true)
export const verifyUser = (request, reply) => {
  dbGetEmailVerification(request.params.hash)
    .then((data) => {
      const fields = {
        active: true,
      };
      dbDelVerificationHash(data.ownerId)
        .then(() => dbUpdateUser(data.ownerId, fields).then(reply))
        .catch(() => reply(Boom.conflict('This verification link is expired')));
    })
    .catch(() => {
      reply(Boom.conflict('This verification link is expired'));
    });
};
