import knex from '../utils/db';

const feedbackFields = [
  'id',
  'createdAt',
  'suggestion',
  'findFriendEasy',
  'findFriendHard',
  'suggestImprovement',
  'rating',
  'goalRate',
  'given_by',
  'OtherReason'
];

export const dbCreateFeedback = ({ checkBoxs, ...fields }) => {
  return knex('feedbacks')
    .insert(fields)
    .returning('id')
    .then(res => dbCreateFeedbackOptions(res[0], checkBoxs))
    .then();
};

export const dbGetFeedback = id => {
  return knex
    .raw(
      `select "feedbacks"."id",
      "suggestion",
      "findFriendEasy",
      "findFriendHard",
      "suggestImprovement",
      "rating",
      "goalRate",
      "given_by",
      "OtherReason",
      "users"."username",
      array_agg("optionId") as "optionLists",
      array_agg("surveyOptions"."option") as "joinAppReasons"
      from "feedbacks"
      join "users" on "feedbacks"."given_by" = "users"."id"
      full outer join "feedback_surveyOption" on "feedbacks"."id"="feedback_surveyOption"."feedbackId"
      full outer join "surveyOptions" on "feedback_surveyOption"."optionId" = "surveyOptions"."id"
      where "feedbacks"."id" = ${id} GROUP BY "feedbacks"."id","users"."username"`
    )
    .then(results => results.rows);
};

export const dbCreateFeedbackOptions = (feedbackId, options) => {
  let optionArray = [];

  if (options) {
    options.forEach(option => {
      optionArray.push({ feedbackId: feedbackId, optionId: option });
    });

    return knex.insert(optionArray).into('feedback_surveyOption');
  }
  return;
};

export const dbGetFeedbacks = () => knex('feedbacks').select(feedbackFields);

export const dbGetTotalFeedbacks = () => knex('feedbacks').count(`id`);

export const dbDelFeedback = id =>
  knex('feedbacks')
    .where({ id })
    .del();
