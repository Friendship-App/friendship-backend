import {getAvatars} from "../handlers/avatars";

const avatars = [
  {
    method: 'GET',
    path: '/avatars',
    handler: getAvatars,
  },
];
export default avatars;

export const routes = server => server.route(avatars);
