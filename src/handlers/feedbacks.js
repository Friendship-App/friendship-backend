import Boom from "boom";
import moment from "moment";

import {
  dbCreateFeedback,
  dbGetFeedbacks,
  dbGetTotalFeedbacks,
  dbDelFeedback,
  dbGetFeedback
} from "../models/feedbacks";

export const CreateFeedback = (request, reply) => {
  return dbCreateFeedback({
    ...request.payload,
    createdAt: moment(),
    suggestion: request.payload.suggestion,
    checkBoxs: request.payload.checkBoxs,
    findFriendEasy: request.payload.findFriendEasy,
    findFriendHard: request.payload.findFriendHard,
    suggestImprovement: request.payload.suggestImprovement,
    rating: request.payload.rating,
    goalRate: request.payload.goalRate,
    given_by: request.payload.given_by,
    OtherReason: request.payload.OtherReason
  }).then(reply);
};

export const getFeedbacks = (request, reply) =>
  dbGetFeedbacks()
    .limit(10)
    .offset(request.params.startIndex - 1)
    .then(reply);

    export const getFeedback = (request, reply) =>
      dbGetFeedback(request.params.feedbackId).then(reply);

export const getTotalFeedbacks = (request, reply) => dbGetTotalFeedbacks().then(reply);

export const delFeedback = (request, reply) =>
  dbDelFeedback(request.params.feedbackId).then(reply);
