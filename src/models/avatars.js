import knex from "../utils/db";

export const dbGetAvatars = () => knex('avatars').select('*');

