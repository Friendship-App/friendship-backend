#!/usr/bin/env node

/* eslint-disable no-console */

import Hoek from 'hoek';
import compose from './server';

compose
  .then((server) => {
    let io = require('socket.io')(server.listener);

    io.on('connection', function (socket) {
      console.log('A client just joined on', socket.id);
      socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
      });
    });

    // Start the server
    server.start((err) => {
      Hoek.assert(!err, err);
      console.log('Server running at:', server.info.uri);
    });
  })
  .catch((err) => {
    console.error('Error while starting server:', err);
  });

