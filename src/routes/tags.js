import {merge} from 'lodash';
import Joi from 'joi';

import {getAuthWithScope} from '../utils/auth';
import {
  activateTag,
  addTag,
  createUserTag,
  createUserTags,
  delTag,
  delUserTag,
  getActivities,
  getInterests,
  getTag,
  getTagList,
  getTags,
  getTagsForUser,
  getTagsUser,
  getUsersInTag,
  updateTag,
} from '../handlers/tags';

const validateTagId = {
  validate: {
    params: {
      tagId: Joi.number()
        .integer()
        .required(),
    }
  },
};

const validateTagState = {
  validate: {
    params: {
      tagId: Joi.number()
        .integer()
        .required(),
    },
    payload: {
      checked: Joi.boolean().required(),
    },
  },
};

const validateTagFields = {
  validate: {
    payload: {
      name: Joi.string(),
      category: Joi.number().integer(),
    },
  },
};

const validateUserTagFields = {
  validate: {
    payload: {
      userId: Joi.number()
        .integer()
        .required(),
      tagId: Joi.number()
        .integer()
        .required(),
      love: Joi.boolean(),
    },
  },
};

const validateUserTagArray = {
  validate: {
    payload: {
      tags: Joi.array(),
    },
  },
};

const tags = [
  // Get a list of all tags
  {
    method: 'GET',
    path: '/tags',
    handler: getTags,
  },{
    method: 'GET',
    path: '/activities',
    handler: getActivities,
  },{
    method: 'GET',
    path: '/interests',
    handler: getInterests,
  },
  {
    method: 'GET',
    path: '/tags/filter',
    config: getAuthWithScope('admin'),
    handler: getTags,
  },

  // Get all the tags of a user
  {
    method: 'GET',
    path: '/tagsForUser/{userId}',
    config: getAuthWithScope('user'),
    handler: getTagsForUser,
  },

  // Get info about a specific tag
  {
    method: 'GET',
    path: '/tags/{tagId}',
    config: merge({}, validateTagId),
    handler: getTag,
  },

  // Add a new tag
  {
    method: 'POST',
    path: '/tags',
    config: merge({}, validateTagFields, getAuthWithScope('user')),
    handler: addTag,
  },

  // Delete a tag, admin only
  {
    method: 'DELETE',
    path: '/tags/{tagId}',
    config: merge({}, validateTagId, getAuthWithScope('admin')),
    handler: delTag,
  },

  // Update tag, admin only
  {
    method: 'PATCH',
    path: '/tags/{tagId}',
    config: merge({}, validateTagId, getAuthWithScope('admin')),
    handler: updateTag,
  },
  // Get all usernames of a tag
  {
    method: 'GET',
    path: '/tag_user/tag/{tagId}',
    config: getAuthWithScope('user'),
    handler: getUsersInTag,
  },
  {
    method: 'GET',
    path: '/tags_user/taglist',
    config: getAuthWithScope('user'),
    handler: getTagList,
  },
  {
    method: 'GET',
    path: '/tags_user/{tagId}',
    config: getAuthWithScope('user'),
    handler: getTagsUser,
  },

  // Add new tag to a user
  // Love is a boolean. True = love, false = hate the tag.
  {
    method: 'POST',
    path: '/user_tag',
    config: merge({}, validateUserTagFields, getAuthWithScope('user')),
    handler: createUserTag,
  },
  // Delete previous user tags & add new user tags
  // Remember to send all user tags at once, or else dat is deleted
  {
    method: 'POST',
    path: '/user_tags',
    config: merge({}, validateUserTagArray, getAuthWithScope('user')),
    handler: createUserTags,
  },
  //  Delete a tag that is connected to a user
  // @todo check if the OWNER is deleting this,
  // and not another user (somehow we can't to get details of authenticated user
  {
    method: 'DELETE',
    path: '/user_tag',
    config: merge({}, validateUserTagFields, getAuthWithScope('user')),
    handler: delUserTag,
  },
  //Activate and deactivate tag
  {
    method: 'PATCH',
    path: '/tags/activate/{tagId}',
    config: merge({}, validateTagState, getAuthWithScope('admin')),
    handler: activateTag,
  },

];

export default tags;

export const routes = server => server.route(tags);
