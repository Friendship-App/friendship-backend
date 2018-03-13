import { getAuthWithScope } from '../utils/auth';
import {
  getChatroom,
  createChatroom,
  getChatroomsByUserId,
} from '../handlers/chatrooms';
import { createMessage } from '../handlers/messages';

const chatrooms = [
  // Get all ms with chatroom Id
  {
    method: 'GET',
    path: '/chatrooms/{chatroomId}',
    config: getAuthWithScope('user'),
    handler: getChatroom,
  },
  // create a message
  {
    method: 'POST',
    path: '/chatrooms/{chatroomId}',
    config: getAuthWithScope('user'),
    handler: createMessage,
  },
  // Get all the chatrooms for a specific user
  {
    method: 'GET',
    path: '/chatrooms/userid/{userId}',
    config: getAuthWithScope('user'),
    handler: getChatroomsByUserId,
  },
  // Create a chatroom
  {
    method: 'POST',
    path: '/chatrooms',
    config: getAuthWithScope('user'),
    handler: createChatroom,
  },
];
export default chatrooms;

export const routes = server => server.route(chatrooms);
