import knex from "../utils/db";

const feedbackFields = [
  "id",
  "createdAt",
  "suggestion",
  "findFriendEasy",
  "findFriendHard",
  "suggestImprovement",
  "rating",
  "goalRate",
  "given_by",
  "checkBoxs",
  "OtherReason"
];

export const dbCreateFeedback = ({ checkBoxs, ...fields }) => {
  return knex("feedbacks")
    .insert(fields)
    .returning("id")
    .then(res => dbCreateFeedbackOptions(res[0], checkBoxs))
    .then();
};

export const dbCreateFeedbackOptions = (feedbackId, options) => {
  let optionArray = [];

  if (options) {
    options.forEach(option => {
      optionArray.push({ feedbackId: feedbackId, optionId: option });
    });

    return knex.insert(optionArray).into("feedback_surveyOption");
  }
  return;
};
