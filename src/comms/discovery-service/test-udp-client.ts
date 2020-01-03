import Discovery = require('./index');
import net = require('net');
import dgram = require('dgram');

// Create TCP server to receive a response from any discovered services
// Created before sending the UDP message to ensure it is ready to receive a
// response to the UDP broadcast.
const server = new net.Server();
server.on('error', (err: Error) => {
  console.error(err);
});
// Close the TCP server after no connection for predefined seconds
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
server.listen(Discovery.PORT_TCP_RESPONSE, '127.0.0.1');

// Broadcast UDP discovery message
// Datagram (UDP) module
const client = dgram.createSocket('udp4');
// Send message
const message = Discovery.MSG_DISCOVER_ADDR;
client.send(
  message,
  0,
  message.length,
  Discovery.PORT_UDP_DISCOVERY,
  (error: Error | null) => {
    // Handle any errors
    if (error) {
      console.error(error);
    }
    // Cleanup after send
    client.close();
  },
);
