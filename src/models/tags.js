import knex from "../utils/db";

const tagListFields = ["id", "user_id", "name", "category", "createdAt"];
const userTagListFields = ["userId", "tagId", "love"];
const tagsForUser = ["id", "name", "category", "love"];
const tagUserListFields = [
  "user_tag.userId",
  "users.username",
  "user_tag.tagId",
  "love",
  "avatar"
];

export const dbGetTagList = () =>
  knex
    .raw(
      `SELECT DISTINCT("tags"."id"), "tags"."name", 
      (SELECT COUNT("user_tag"."love") AS "nbLoves" FROM "user_tag" WHERE "user_tag"."love" = TRUE),
      (SELECT COUNT("user_tag"."love") AS "nbHates" FROM "user_tag"
      WHERE "user_tag"."love" = FALSE),
      "tags"."user_id" AS "creator", "tags"."createdAt"
      FROM "tags"
      left join "user_tag"
      ON "tags"."id" = "user_tag"."userId"
      ORDER BY "tags"."createdAt" DESC;`
    )
    .then(results => results.rows);

export const dbGetFilteredTags = filter =>
  knex
    .raw(
      `SELECT DISTINCT("tags"."id"), "tags"."name",
      (SELECT COUNT("user_tag"."love") AS "nbLoves" FROM "user_tag"
      WHERE "user_tag"."love" = TRUE),
      (SELECT COUNT("user_tag"."love") AS "nbHates" FROM "user_tag"
      WHERE "user_tag"."love" = FALSE),
      "tags"."user_id" AS "creator", "tags"."createdAt"
      FROM "tags"
      left join "user_tag"
      ON "tags"."id" = "user_tag"."userId"
      WHERE tags.name LIKE '%${filter.name}%'
      ORDER BY "tags"."createdAt" DESC;`
    )
    .then(results => results.rows);

export const dbGetTags = () => knex("tags").select(tagListFields);

export const dbGetActivities = () => knex('tags').where('category', 1).select(tagListFields);

export const dbGetInterests = () => knex('tags').where('category', 2).select(tagListFields);

export const dbGetTag = id =>
  knex("tags")
    .first()
    .where({id});

//  Get all tags that a user has chosen to be either loved or hated
export const dbGetTagsForUser = userId =>
  knex("tags")
    .select(tagsForUser)
    .leftJoin("user_tag", "user_tag.tagId", "tags.id")
    .where({"user_tag.userId": userId});

// Get all the users of a tag, used by users in searching for users who love/hate a tag. (includes username and avatar)
export const dbGetUsersInTag = tagId =>
  knex("user_tag")
    .select(tagUserListFields)
    .join("users", "user_tag.userId", "=", "users.id")
    .where({tagId});

export const dbCreateTag = ({...fields}) =>
  knex.transaction(async trx => {
    const tag = await trx("tags")
      .insert(fields)
      .returning("*")
      .then(results => results[0]); // return only first result

    return tag;
  });

export const dbDelTag = id =>
  knex("tags")
    .where({id})
    .del();

export const dbUpdateTag = (id, fields) =>
  knex("tags")
    .update({...fields})
    .where({id})
    .returning("*");

// Get all the users of a tag, used in admin to check how many loves/hates a tag has
export const dbGetTagsUser = tagId =>
  knex("user_tag")
    .select(userTagListFields)
    .where({tagId});

// Add a new tag that a user loves/hates
export const dbCreateUserTag = ({...fields}) =>
  knex.transaction(async trx => {
    const tag = await trx("user_tag")
      .insert(fields)
      .returning("*")
      .then(results => results[0]); // return only first result

    return tag;
  });

function dbAddTagsToUser(userId, tagsArray, love = false) {
  knex.transaction(async (trx) => {
    const tags = [];
    tagsArray.forEach((tag) => {
      tags.push({userId, tagId: tag, love})
    });

    await trx('user_tag').insert(tags).then();
  })
}

export const dbCreateUserTags = (userId, yeahsArray, nahsArray) =>
  knex.transaction(async (trx) => {
    await trx('user_tag').where({userId}).del();
    await dbAddTagsToUser(userId, yeahsArray, true);
    await dbAddTagsToUser(userId, nahsArray);
  });

//  Delete a user_tag
export const dbDelUserTag = (userId, tagId) =>
  knex('user_tag')
    .where({userId, tagId})
    .del();
// Activate tag
export const dbActivateTag = (id, checked) =>
  knex('tags')
    .where('id', id)
    .update({active: checked});

