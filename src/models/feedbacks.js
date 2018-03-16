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
  'checkBoxs',
];


export const dbCreateFeedback = ({ ...fields }) =>
  knex.transaction(async trx => {
    const feedback = await trx('feedbacks')
      .insert(fields)
      .returning('*')
      .then(results => results[0]);
    return feedback;
  });
