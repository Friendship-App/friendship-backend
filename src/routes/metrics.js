import { getAuthWithScope } from '../utils/auth';
import {
  getNbMatchesMessaging,
  getNbMessagesByConversation,
  getNbMessages,
<<<<<<< HEAD
  getNbActiveUsers,
  getNbRegisteredUsers
=======
  displayRegisteredUsers,
  updateRegisteredUsers,
  displayActiveUsers,
  updateActiveUsers,
>>>>>>> c7efdc1cf3ea2a3a1a0b75bf92458f280ba94535
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
];

export default metrics;

export const routes = server => server.route(metrics);
