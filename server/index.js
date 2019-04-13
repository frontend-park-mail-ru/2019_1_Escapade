'use strict';

const express = require('express');
const morgan = require('morgan');
const WebSocketServer = require('ws');
const fallback = require('express-history-api-fallback');


const app = express();

app.use(morgan('dev'));
app.use(express.static('./public/dist'));

app.use(fallback('./index.html', {root: './public/dist'}));
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening port ${port}`);
});


// подключенные клиенты
const clients = {};

// WebSocket-сервер на порту 8081
const webSocketServer = new WebSocketServer.Server({
  port: 8081,
});
webSocketServer.on('connection', function(ws) {
  const id = Math.random();
  clients[id] = ws;
  console.log('New connection' + id);

  ws.on('message', function(message) {
    console.log('send message ' + message);
    // eslint-disable-next-line guard-for-in
    for (const key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('connection close' + id);
    delete clients[id];
  });
});
