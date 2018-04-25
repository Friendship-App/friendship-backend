import Boom from 'boom';
import {
  dbGetAllMsWithChatroomId,
  dbCreateChatroom,
  dbGetChatroomsByUserId,
} from '../models/chatrooms';

export const getChatroom = (request, reply) =>
  dbGetAllMsWithChatroomId(request.params.chatroomId).then(reply);

export const getChatroomsByUserId = (request, reply) =>
  dbGetChatroomsByUserId(request.params.userId).then(reply);

export const createChatroom = (request, reply) =>
  dbCreateChatroom({
    user_creator_id: request.payload.userCreatorId,
    user_receiver_id: request.payload.userReceiverId,
  })
    .then(reply)
    .catch((err) => {
      if (err.constraint) {
        reply(Boom.conflict('Constraint Error: ', err));
      } else {
        reply(Boom.badImplementation(err));
      }
    });
