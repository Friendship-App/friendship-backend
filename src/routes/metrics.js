import { getAuthWithScope } from '../utils/auth';
import {
  getNbMatchesMessaging,
  getNbMessagesByConversation,
  getNbMessages,
  getNbActiveUsers,
  getCountActiveUsers,
  getRegisteredUsersData,
  updateRegisteredUsersData,
  displayRegisteredUsers,
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
    handler: getNbActiveUsers,
  },
  {
    method: 'GET',
    path: '/metrics/activeusers/update',
    config: getAuthWithScope('admin'),
    handler: getCountActiveUsers,
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
    handler: updateRegisteredUsersData,
  },
  {
    method: 'GET',
    path: '/metrics/registeredusers/get',
    config: getAuthWithScope('admin'),
    handler: getRegisteredUsersData,
  }
];

export default metrics;

export const routes = server => server.route(metrics);
