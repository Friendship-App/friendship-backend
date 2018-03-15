import { merge } from 'lodash';
import Joi from 'joi';

import { getAuthWithScope } from '../utils/auth';
import { CreateFeedback } from '../handlers/feedbacks';

const validateFeedbackFields = {
  validate: {
    payload: {
      suggestion: Joi.string().allow(''),
      easy: Joi.string().allow(''),
      hard: Joi.string().allow(''),
      improve: Joi.string().allow(''),
      suggestion: Joi.string().allow(''),
      rating: Joi.number().allow(''),
      goalRate: Joi.number().allow(''),
      checkBoxs: Joi.string().allow(''),
      given_by: Joi.number()
        .integer()
        .required()
    }
  }
};

const feedbacks = [
  // Register new reports
  {
    method: 'POST',
    path: '/feedbacks',
    config: merge({}, validateFeedbackFields, getAuthWithScope('user')),
    handler: CreateFeedback
  }
];

export default feedbacks;

// Here we register the routes
export const routes = server => server.route(feedbacks);
