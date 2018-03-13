import Boom from 'boom';
import {
  dbGetMessages,
  dbGetMessage,
  dbCreateMessage,
  dbUpdateReadMessages,
} from '../models/messages';

export const getMessages = (request, reply) => dbGetMessages().then(reply);

export const getMessageForUser = (request, reply) =>
  dbGetMessage(request.params.messageId).then(reply);

export const createMessage = (request, reply) =>
  dbCreateMessage({
    chat_time: new Date(),
    user_id: request.payload.userId,
    text_message: request.payload.textMessage,
    chatroom_id: request.params.chatroomId,
  })
    .then((message) => {
      this.publish(`/chatrooms/${request.params.chatroomId}`, message);
      return message;
    })
    .then(reply)
    .catch((err) => {
      if (err.constraint) {
        reply(Boom.conflict('Constraint Error: ', err));
      } else {
        reply(Boom.badImplementation(err));
      }
    });

export const updateReadMessages = (request, reply) =>
  dbUpdateReadMessages(request.payload.messageIdArr)
    .then(reply)
    .catch((err) => {
      if (err.constraint) {
        reply(Boom.conflict('Constraint Error: ', err));
      } else {
        reply(Boom.badImplementation(err));
      }
    });
