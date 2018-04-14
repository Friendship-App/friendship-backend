import { merge } from "lodash";
import Joi from "joi";

import { getAuthWithScope } from "../utils/auth";
import {
  CreateFeedback,
  getFeedbacks,
  getFeedback,
  getTotalFeedbacks,
  delFeedback,
} from "../handlers/feedbacks";

const validateFeedbackFields = {
  validate: {
    payload: {
      suggestion: Joi.string().allow(""),
      findFriendEasy: Joi.string().allow(""),
      findFriendHard: Joi.string().allow(""),
      suggestImprovement: Joi.string().allow(""),
      suggestion: Joi.string().allow(""),
      rating: Joi.number().allow(""),
      goalRate: Joi.number().allow(""),
      OtherReason: Joi.string().allow(""),
      checkBoxs: Joi.array(),
      given_by: Joi.number()
        .integer()
        .required()
    }
  }
};

const feedbacks = [
  // Register new feedback
  {
    method: "POST",
    path: "/feedbacks",
    config: merge({}, validateFeedbackFields, getAuthWithScope("user")),
    handler: CreateFeedback
  },
  {
    method: "GET",
    path: "/feedback/{startIndex}",
    config: getAuthWithScope("admin"),
    handler: getFeedbacks
  },
  {
    method: "GET",
    path: "/getTotalFeedbacks",
    config: getAuthWithScope("admin"),
    handler: getTotalFeedbacks
  },
  {
    method: "GET",
    path: "/feedbacks/{feedbackId}",
    config: merge({}, getAuthWithScope("admin")),
    handler: getFeedback
  },
  {
    method: "DELETE",
    path: "/feedbacks/{feedbackId}",
    config: merge({}, getAuthWithScope("admin")),
    handler: delFeedback
  }
];

export default feedbacks;

// Here we register the routes
export const routes = server => server.route(feedbacks);
