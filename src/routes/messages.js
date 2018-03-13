import { getAuthWithScope } from '../utils/auth';
import {
  getMessages,
  getMessageForUser,
  createMessage,
  updateReadMessages,
} from '../handlers/messages';

const messages = [
  // Get all the messages
  {
    method: 'GET',
    path: '/messages',
    config: getAuthWithScope('admin'),
    handler: getMessages,
  },

  // Get all the messages from a specific user
  {
    method: 'GET',
    config: getAuthWithScope('user'),
    path: '/messages/{messageId}',
    handler: getMessageForUser,
  },

  // Register new messages
  // we use the route /chatrooms/{chatroomId} to send message
  {
    method: 'POST',
    path: '/messages',
    config: getAuthWithScope('user'),
    handler: createMessage,
  },

  // Modified messages' "read" field
  {
    method: 'PUT',
    path: '/messages/read',
    config: getAuthWithScope('user'),
    handler: updateReadMessages,
  },
];
export default messages;

export const routes = server => server.route(messages);
