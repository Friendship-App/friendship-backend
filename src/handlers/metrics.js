import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbGetNbActiveUsers,
  dbCountRegisteredUsers,
  dbGetNbRegisteredUsers,
  dbCountActiveUsers,
} from '../models/metrics';


export const getNbMatchesMessaging = (request, reply) => {
  dbGetNbMatchesMessaging().then(reply);
};

export const getNbMessagesByConversation = (request, reply) => {
  dbGetNbMessagesByConversation().then(reply);
};

export const getNbMessages = (request, reply) => {
  dbGetNbMessages().then(reply);
};

// danni
export const getNbRegisteredUsers = (request, reply) => {
  dbGetNbRegisteredUsers().then(reply);
};

// minh
export const getCountRegisteredUsers = (request, reply) => {
  dbCountRegisteredUsers().then(reply);
};

export const getNbActiveUsers = (request, reply) => {
  dbGetNbActiveUsers().then(reply);
};

export const getCountActiveUsers = (request, reply) => {
  dbCountActiveUsers().then(reply);
};

//insert active usercount everyday at 23:59
const cron = require('node-cron');
cron.schedule('*/5 * * * * *', function(){
  console.log(' START --------------------------');
  //getCountActiveUsers();
  console.log(' END --------------------------');
});
