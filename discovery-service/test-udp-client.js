'use strict';

const {
  MSG_DISCOVER_ADDR,
  PORT_UDP_DISCOVERY: PORT_UDP,
  PORT_TCP_RESPONSE: PORT_TCP,
} = require('./index.js');

// Create TCP server to receive a reponse from any discovered services
// Created before sending the UDP message to ensure it is ready to receive a
// response to the UDP broadcast.
const { Server } = require('net');
let server = new Server();
server.on('error', err => {
  console.error(err);
});
// Close the TCP server after not receiving a connection for predefined seconds
const iTimeout = 5000;
const timeoutObj = setTimeout(() => {
  console.log(
    'Server auto-closed: no client connected within ' +
      iTimeout / 1000 +
      ' seconds',
  );
  server.close();
}, iTimeout);
// Get client IP address from connection
server.on('connection', socket => {
  console.debug('Connection from: ' + socket.remoteAddress);
  clearTimeout(timeoutObj);
  server.close();
});
// Listen for discovered devices
server.listen(PORT_TCP, '127.0.0.1');

// Broadcast UDP discovery message
// Datagram (UDP) module
const { createSocket } = require('dgram');
let client = createSocket('udp4');
// Send message
const message = MSG_DISCOVER_ADDR;
client.send(message, 0, message.length, PORT_UDP, (error, bytes) => {
  // Handle any errors
  if (error) {
    console.error(error);
  }
  // Cleanup after send
  client.close();
});
