'use strict';

const { MSG_DISCOVER_ADDR, PORT} = require('./index.js');

// Datagram module - UDP
const { createSocket } = require('dgram');
let client = createSocket('udp4');

// Send message
const message = MSG_DISCOVER_ADDR;
client.send(message, 0, message.length, PORT, function callback(
  error,
  bytes,
) {
  // Handle any errors
  if (error) {
    console.error(error);
  }
  // Cleanup after send
  client.close();
});
