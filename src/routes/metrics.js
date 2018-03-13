import { getAuthWithScope } from '../utils/auth';
import {
  displayRegisteredUsers,
  updateRegisteredUsers,
  displayActiveUsers,
  updateActiveUsers,
  displayActiveConversation,
  updateActiveConversations,
  displayConversationsLength,
  updateAverageConversationsLength,
  displayAllMetrics,
  displayWeekMetrics,
  displayMonthMetrics,
} from '../handlers/metrics';

const metrics = [
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
  },
  {
    method: 'GET',
    path: '/metrics',
    config: getAuthWithScope('admin'),
    handler: displayAllMetrics,
  },
  {
    method: 'GET',
    path: '/metrics/week',
    config: getAuthWithScope('admin'),
    handler: displayWeekMetrics,
  },
  {
    method: 'GET',
    path: '/metrics/month',
    config: getAuthWithScope('admin'),
    handler: displayMonthMetrics,
  },
];

export default metrics;

export const routes = server => server.route(metrics);
