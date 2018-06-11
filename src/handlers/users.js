import Boom from 'boom';
import moment from 'moment';

import {resizeImage} from '../utils/image';
import {createToken, hashPassword} from '../utils/auth';
import {
  dbBanUser,
  dbCreateUser,
  dbDelUser,
  dbDelVerificationHash,
  dbFetchUserBan,
  dbGet30DaysUsers,
  dbGetEmailVerification,
  dbGetFilteredUsers,
  dbGetUser, dbGetUserByEmail,
  dbGetUserByUsername,
  dbGetUsers,
  dbGetUsersBatch, dbRegisterNotificationToken,
  dbUnbanUser,
  dbUpdatePassword,
  dbUpdateUser,
} from '../models/users';
import {dbCreateUserLocations} from "../models/locations";
import {dbCreateUserPersonalities} from "../models/personalities";
import {dbCreateUserTags} from "../models/tags";
import {updateUserGender} from '../models/genders';

export const getUsers = (request, reply) => {
  if (request.query.filter) {
    return dbGetFilteredUsers(request.query.filter).then(reply);
  }
  return dbGetUsers().then(reply);
};

export const get30DaysUsers = (request, reply) =>
  dbGet30DaysUsers().then(reply);
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
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== request.params.userId
  ) {
    return reply(
      Boom.unauthorized('Unprivileged users can only delete own userId!'),
    );
  }

  return dbDelUser(request.params.userId).then(reply);
};

export const updateUser = async (request, reply) => {
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== parseInt(request.params.userId, 10)
  ) {
    return reply(
      Boom.unauthorized(
        'Unprivileged users can only perform updates on own userId!',
      ),
    );
  }

  const fields = [];
  const genderArr = [];
  for (let field in request.payload) {
    if (field !== 'genders') {
      fields[field] = request.payload[field];
    }
  }

  if (request.payload.genders) {
    const genders = JSON.parse(request.payload.genders);
    for (let i = 0; i < genders.length; i++) {
      genderArr.push({userId: request.params.userId, genderId: genders[i]})
    }

    updateUserGender(genderArr, request.params.userId);
  }

  // Only admins are allowed to modify user scope
  if (request.pre.user.scope === 'admin' && request.payload.scope) {
    fields.scope = request.payload.scope;
  }

  if (fields.password) {
    hashPassword(fields.password).then((hashedPassword) => {
      dbUpdatePassword(request.pre.user.id, hashedPassword).catch((err) => {
        console.log(err);
      });
    });

    delete fields.password;
  }

  return dbUpdateUser(request.params.userId, {...fields}).then(reply);
};

export const banUser = (request, reply) => {
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== request.params.userId
  ) {
    return reply(
      Boom.unauthorized("You don't have the permissions to do this action"),
    );
  }

  const fields = {
    user_id: request.payload.userId,
    banned_by: request.pre.user.id,
    reason: request.payload.reason,
    expire:
      !request.payload.expire || request.payload.expire === 'x'
        ? null
        : moment()
          .add(
            request.payload.expire.split(':')[0],
            request.payload.expire.split(':')[1],
          )
          .utc()
          .toISOString(),
  };


  return dbFetchUserBan(request.params.userId).then((result) => {
    if (result.length) return reply(Boom.conflict('User is already banned'));

    return dbBanUser(request.params.userId, fields).then(reply);
  });
};

export const unbanUser = (request, reply) => {
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== request.params.userId
  ) {
    return reply(
      Boom.unauthorized('Unprivileged users cannot do this!'),
    );
  }

  return dbUnbanUser(request.params.userId).then(reply);
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
  let createdUser = {};

  // request.payload.forEach((field) => { fields[field] = request.payload[field]; });

  for (const field in request.payload) {
    fields[field] = request.payload[field];
  }

  hashPassword(request.payload.password)
    .then(passwordHash =>
      dbCreateUser({
        scope: 'user',
        email: request.payload.email.toLowerCase().trim(),
        description: fields.description,
        username: fields.username,
        avatar: fields.avatar,
        image: fields.image,
        enableMatching: fields.enableMatching,
        birthyear: fields.birthyear,
        password: passwordHash,
        genders: fields.genders
      }).then((userData) => {
        createdUser = userData;
      }).then(() => {
        dbCreateUserLocations(createdUser.id, fields.locations);
      }).then(() => {
        dbCreateUserPersonalities(createdUser.id, fields.personalities);
      }).then(() => {
        dbCreateUserTags(createdUser.id, fields.yeahs, fields.nahs);
      })
    ).then(() => {
    return reply(
      createToken({
        id: createdUser.id,
        email: createdUser.email,
        scope: createdUser.scope,
      }))
  }).catch((err) => {
    if (err) {
      console.log(err);
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

export const validateUserByUsername = (request, reply) =>
  dbGetUserByUsername(request.query['username']).then(reply);

export const validateEmailAvailibility = (request, reply) =>
  dbGetUserByEmail(request.query['email']).then(reply);

export const registerNotificationToken = (request, reply) =>
  dbRegisterNotificationToken(request.pre.user.id, request.payload.token).then(reply);
