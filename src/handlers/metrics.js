import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbGetNbActiveUsers,
  dbCountActiveUsers,
  dbUpdateRegisterdUsersData,
  dbGetRegisteredUsersData,
  dbDisplayRegisteredUsersData,
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
export const getRegisteredUsersData = (request, reply) => {
  dbGetRegisteredUsersData().then(reply);
};

export const updateRegisteredUsersData = (request, reply) => {
  dbUpdateRegisterdUsersData().then(reply);
};

// minh
export const displayRegisteredUsers = (request, reply) => {
  dbDisplayRegisteredUsersData().then(reply);
};

export const getNbActiveUsers = (request, reply) => {
  dbGetNbActiveUsers().then(reply);
};

export const getCountActiveUsers = (request, reply) => {
  dbCountActiveUsers().then(reply);
};

// insert active usercount everyday at 23:59
const cron = require('node-cron');
cron.schedule('0 0 * * *', function(){
  console.log(' START --------------------------0:00');
  //getCountActiveUsers();
  console.log(' END --------------------------');
});
