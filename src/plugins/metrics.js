import cron from 'node-cron';
import {
  dbUserLastActive,
  dbUpdateRegisteredUsersData,
  dbUpdateActiveUsersData,
  dbUpDateActiveConversationsData,
  dbUpdateAverageConversationsLength,
} from '../models/metrics';

// Cron job runs every minute so metrics are populated and there is smth to show on metrics
cron.schedule('1 * * * * *', async () => {
  console.log(' START Cron job -----------------1 min');
  try {
    await dbUpdateRegisteredUsersData();
    await dbUpdateActiveUsersData();
    await dbUpDateActiveConversationsData();
    await dbUpdateAverageConversationsLength();
  } catch (e) {
    console.log('error with Cron: ', e);
  }

  console.log(' END --------------------------');
});

exports.register = (server, options, next) => {
  server.ext('onPostHandler', async (request, reply) => {
    const user = request.pre.user;

    if (user) {
      // for each request that a user make it will update the last active field
      await dbUserLastActive(user.id);
    }

    return reply.continue();
  });
  next();
};

exports.register.attributes = {
  name: 'metrics',
  version: '1.0.0',
};
