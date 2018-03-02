import { getAuthWithScope } from '../utils/auth';
import {
    getMessages,
    getMessage,
    createMessage,
    updateReadMessages,
} from '../handlers/messages';

const messages = [
    // Get a list of all users
  {
    method: 'GET',
    path: '/messages',
    handler: getMessages,
  },
   // Get info about a specific user
  {
    method: 'GET',
    path: '/messages/{messageId}',
    handler: getMessage,
  },

  // Register new messages
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
  // Here we register the routes
export const routes = server => server.route(messages);
