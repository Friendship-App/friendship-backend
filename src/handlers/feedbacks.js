import Boom from "boom";
import moment from "moment";

import { dbCreateFeedback, dbGetFeedbacks } from "../models/feedbacks";

export const getFeedbacks = (request, reply) =>
  dbGetFeedbacks()
    .limit(10)
    .offset(request.params.pageNumber - 1)
    .orderBy("id")
    .then(reply);

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
