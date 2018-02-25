import {
  dbGetNbMatchesMessaging,
  dbGetNbMessagesByConversation,
  dbGetNbMessages,
  dbDisplayNbRegisteredUsers,
  dbDisplayActiveUsersData,
  dbUpdateActiveUsersData,
  dbDisplayActiveConversationData,
  dbUpDateActiveConversationsData,
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

/* export const updateRegisteredUsers = (request, reply) => {
  dbUpdateRegisteredUsersData().then(reply);
};

// minh
export const displayRegisteredUsers = (request, reply) => {
  dbDisplayRegisteredUsersData().then(reply);
}; */

export const getRegisteredUsers=(request,reply)=>{
  
  console.log(typeof dbDisplayNbRegisteredUsers());

  console.log('==Check==',dbDisplayNbRegisteredUsers());
  return dbDisplayNbRegisteredUsers().then(reply)
}

export const displayActiveUsers = (request, reply) => {
  dbDisplayActiveUsersData().then(reply);
};

export const updateActiveUsers = (request, reply) => {
  dbUpdateActiveUsersData().then(reply);
};

export const displayActiveConversation = (request, reply) => {
  dbDisplayActiveConversationData().then(reply);
};

export const updateActiveConversations = (request, reply) => {
  dbUpDateActiveConversationsData().then(reply);
};

// insert active usercount everyday at 23:59
const cron = require('node-cron');
cron.schedule('0 0 * * *', function(){
  console.log(' START --------------------------0:00');
  //getCountActiveUsers();
  console.log(' END --------------------------');
});
