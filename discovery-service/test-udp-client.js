'use strict';

const Discovery = require('./index.js');

// Datagram module - UDP
const dgram = require('dgram');
let client = dgram.createSocket('udp4');

// Send message
const message = Discovery.MSG_DISCOVER_ADDR;
client.send(message, 0, message.length, Discovery.PORT, function callback(
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
