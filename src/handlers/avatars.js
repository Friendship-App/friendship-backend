import {dbGetAvatars} from "../models/avatars";

export const getAvatars = (request, reply) => dbGetAvatars().then(reply);
