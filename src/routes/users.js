import { merge } from 'lodash';
import Joi from 'joi';

import {getAuthWithScope, doAuth, doAuthAdmin} from '../utils/auth';
import {
  getUsers,
  getUsersBatch,
  getUser,
  updateUser,
  delUser,
  banUser,
  unbanUser,
  authUser,
  registerUser,
  verifyUser,
  getUserByUsername,
  getFilteredUsers,
  get30DaysUsers, validateUserByUsername, validateEmailAvailibility, registerNotificationToken, checkUserStatus,
} from '../handlers/users';

const validateUserId = {
  validate: {
    params: {
      userId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validateRegistrationFields = {
  validate: {
    payload: {
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      birthyear: Joi.number().required(),
      enableMatching: Joi.boolean(),
      description: Joi.string().required(),
      image: Joi.string(),
      genders: Joi.array().required(),
      locations: Joi.array().required(),
      personalities: Joi.array().required(),
      yeahs: Joi.array(),
      nahs: Joi.array(),
      avatar: Joi.string(),
    },
  },
};

const validateBanFields = {
  validate: {
    payload: {
      reason: Joi.string().required(),
      expire: Joi.string(),
    },
    params: {
      userId: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validatePageNumber = {
  validate: {
    params: {
      pageNumber: Joi.number()
        .integer()
        .required(),
    },
  },
};

const validateUserDetails = {
  validate: {
    payload: {
      username: Joi.string(),
      password: Joi.string(),
      scope: Joi.string(),
      email: Joi.string().email(),
      description: Joi.string().allow(''),
      avatar: Joi.string(),
      image: Joi.string(),
      compatibility: Joi.string(),
      location: Joi.string(),
      enableMatching: Joi.boolean(),
      birthyear: Joi.number(),
      active: Joi.boolean(),
      genderArr: Joi.array(),
    },
  },
};

const users = [
  // Get a list of all users
  {
    method: 'GET',
    path: '/users',
    config: getAuthWithScope('user'),
    handler: getUsers,
  },
  {
    method: 'GET',
    path: '/users/30days',
    config: getAuthWithScope('admin'),
    handler: get30DaysUsers,
  },
  {
    method: 'GET',
    path: '/users/filter',
    config: getAuthWithScope('admin'),
    handler: getUsers,
  },

  // Get a list of users in batches. Used with infinite scroller
  // Starts with page 0 lol
  {
    method: 'GET',
    path: '/users/page/{pageNumber}',
    config: merge({}, validatePageNumber, getAuthWithScope('user')),
    handler: getUsersBatch,
  },

  // Get info about a specific user by username
  {
    method: 'GET',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('user')),
    handler: getUser,
  },

  // Get info about a specific user
  {
    method: 'PATCH',
    path: '/users/{userId}',
    config: merge({}, getAuthWithScope('user')),
    handler: updateUser,
  },

  // Update user profile
  {
    method: 'DELETE',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: delUser,
  },

  // Delete a user, admin only
  {
    method: 'POST',
    path: '/users/{userId}/ban',
    config: merge({}, validateBanFields, getAuthWithScope('admin')),
    handler: banUser,
  },
  {
    method: 'DELETE',
    path: '/users/unban/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: unbanUser,
  },

  {
    method: 'POST',
    path: '/users/authenticate',
    config: doAuth,
    handler: authUser,
  },

  {
    method: 'POST',
    path: '/users/authenticateAdmin',
    config: doAuthAdmin,
    handler: authUser,
  },

  {
    method: 'GET',
    path: '/users/isBanned',
    config: merge({}, getAuthWithScope('user')),
    handler: checkUserStatus,
  },

  // Authenticate as user
  {
    method: 'POST',
    path: '/users',
    config: validateRegistrationFields,
    handler: registerUser,
  },

  // Register new user
  {
    method: 'GET',
    path: '/users/verify/{hash}',
    handler: verifyUser,
  },

  // Verify a new user using a hash e-mail link
  {
    method: 'GET',
    path: '/users/search/{username}',
    config: merge({}, getAuthWithScope('user')),
    handler: getUserByUsername,
  },

  // Get info about a specific user by username
  {
    method: 'GET',
    path: '/users/validate/username',
    handler: validateUserByUsername,
  },

  // Check email is not already used
  {
    method: 'GET',
    path: '/users/validate/email',
    handler: validateEmailAvailibility,
  },

  // push notifications
  {
    method: 'PATCH',
    path: '/users/push-token',
    handler: registerNotificationToken,
  },
];

export default users;

// Here we register the routes
export const routes = server => server.route(users);
