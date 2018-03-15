import Boom from 'boom';
import moment from 'moment';

import { dbCreateFeedback } from '../models/feedbacks';

export const CreateFeedback = (request, reply) =>
  dbCreateFeedback({
    ...request.payload,
    createdAt: moment(),
    suggestion: request.payload.suggestion,
    checkBoxs:request.payload.checkBoxs,
    easy: request.payload.easy,
    hard: request.payload.hard,
    improve: request.payload.improve,
    rating: request.payload.rating,
    goalRate: request.payload.goalRate,
    given_by: request.payload.given_by
  }).then(reply);
