import { getAuthWithScope } from '../utils/auth';
import {
  getNbMatchesMessaging,
  getNbMessagesByConversation,
  getNbMessages,
  displayRegisteredUsers,
  updateRegisteredUsers,
  displayActiveUsers,
  updateActiveUsers,
  displayActiveConversation,
  updateActiveConversations,
  displayConversationsLength,
  updateAverageConversationsLength,
} from '../handlers/metrics';

const metrics = [
  {
    method: 'GET',
    path: '/metrics/messages',
    config: getAuthWithScope('admin'),
    handler: getNbMessages,
  },
  {
    method: 'GET',
    path: '/metrics/activeusers',
    config: getAuthWithScope('admin'),
    handler: displayActiveUsers,
  },
  {
    method: 'GET',
    path: '/metrics/activeusers/update',
    config: getAuthWithScope('admin'),
    handler: updateActiveUsers,
  },
  {
    method: 'GET',
    path: '/metrics/messagesbyconversation',
    config: getAuthWithScope('admin'),
    handler: getNbMessagesByConversation,
  },
  {
    method: 'GET',
    path: '/metrics/messagesmessaging',
    config: getAuthWithScope('admin'),
    handler: getNbMatchesMessaging,
  },
  {
    method: 'GET',
    path: '/metrics/registeredusers',
    config: getAuthWithScope('admin'),
    handler: displayRegisteredUsers,
  },
  {
    method: 'GET',
    path: '/metrics/registeredusers/update',
    config: getAuthWithScope('admin'),
    handler: updateRegisteredUsers,
  },
  {
    method: 'GET',
    path: '/metrics/activeconversations',
    config: getAuthWithScope('admin'),
    handler: displayActiveConversation,
  },
  {
    method: 'GET',
    path: '/metrics/activeconversations/update',
    config: getAuthWithScope('admin'),
    handler: updateActiveConversations,
  },
  {
    method: 'GET',
    path: '/metrics/conversationslength',
    config: getAuthWithScope('admin'),
    handler: displayConversationsLength,
  },
  {
    method: 'GET',
    path: '/metrics/conversationslength/update',
    config: getAuthWithScope('admin'),
    handler: updateAverageConversationsLength,
  }
];

export default metrics;

export const routes = server => server.route(metrics);
