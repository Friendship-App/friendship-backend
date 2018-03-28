import Boom from 'boom';

import {
  dbGetPersonalities,
  dbGetPersonality,
  dbUpdatePersonality,
  dbDelPersonality,
  dbCreatePersonality,
  dbGetUserPersonalities,
  dbUpdateUserPersonality,
  dbCreateUserPersonality,
  dbCreateUserPersonalities,
} from '../models/personalities';

export const getPersonalities = (request, reply) =>
  dbGetPersonalities().then(reply);

export const getPersonality = (request, reply) =>
  dbGetPersonality(request.params.personalityId).then(reply);

// delete this will affect FK in user_personality
// cannot use at the moment --> need to drop cascade
export const delPersonality = (request, reply) => {
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== request.params.userId
  ) {
    return reply(
      Boom.unauthorized('Unprivileged users cannnot delete personality!'),
    );
  }
  return dbDelPersonality(request.params.personalityId).then(reply);
};

export const updatePersonality = async (request, reply) => {
  if (request.pre.user.scope !== 'admin') {
    return reply(
      Boom.unauthorized('Unprivileged users cannnot update personality!'),
    );
  }

  const fields = {
    name: request.payload.name,
  };

  return dbUpdatePersonality(request.params.personalityId, fields).then(reply);
};

export const createPersonality = (request, reply) =>
  dbCreatePersonality({
    ...request.payload,
    name: request.payload.name,
  })
    .then(reply)
    .catch(err => reply(Boom.badImplementation(err)));

export const getUserPersonalities = (request, reply) =>
  dbGetUserPersonalities(request.params.userId).then(reply);

export const updateUserPersonality = async (request, reply) => {
  if (request.pre.user.id !== parseInt(request.payload.userId, 10)) {
    return reply(Boom.unauthorized('Cannot update other users!'));
  }

  const fields = {
    level: request.payload.level,
  };

  return dbUpdateUserPersonality(
    request.payload.userId,
    request.payload.personalityId,
    fields,
  )
    .then(reply)
    .catch((err) => {
      if (err.constraint) {
        reply(Boom.conflict('Constraint Error: ', err));
      } else {
        reply(Boom.badImplementation(err));
      }
    });
};

export const createUserPersonality = (request, reply) =>
  dbCreateUserPersonality({
    ...request.payload,
    userId: request.pre.user.id,
    personalityId: request.payload.personalityId,
    level: request.payload.level,
  })
    .then(reply)
    .catch((err) => {
      if (err.constraint) {
        reply(Boom.conflict('Constraint Error: ', err));
      } else {
        reply(Boom.badImplementation(err));
      }
    });

// Batch add an array of personalities to a user
// Format payload
// personalities: [{"personalityId": 1, "level":5}, {"personalityId": 1, "level":5}]
export const createUserPersonalities = (request, reply) => {
  const personalities = [];
  for (let i = 0; i < request.payload.personalities.length; i++) {
    personalities.push({
      personalityId: request.payload.personalities[i].personalityId,
      userId: request.pre.user.id,
      level: request.payload.personalities[i].level,
    });
  }
  return dbCreateUserPersonalities(request.pre.user.id, personalities)
    .then(reply)
    .catch((err) => {
      // console.log(err)
      reply(
        Boom.conflict(
          "One of the personalities is already added to this user and can't be added again",
        ),
      );
    });
};
