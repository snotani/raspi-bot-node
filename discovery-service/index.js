'use strict';

const { getLocalIPAddress } = require('../util');

/** Port number for the UDP Discovery service */
const PORT_UDP_DISCOVERY = process.env.RPIBOT_DISCOVERY_PORT || 8089;
const MSG_DISCOVER_ADDR = 'DISCOVER_PIBOT_ADDR';
const MSG_DISCOVER_ADDR_RESPONSE = 'PIBOT_ADDR=';

function allowDiscovery() {
  // Datagram module - UDP
  const { createSocket } = require('dgram');
  let server = createSocket('udp4');
  server.bind(PORT_UDP_DISCOVERY);

  // On udp message received
  server.on('message', async function(message, rinfo) {
    const output = 'Message: "' + message + '"; Address: ' + rinfo.address;
    console.debug(output);

    if (message.toString() === MSG_DISCOVER_ADDR) {
      const response =
        MSG_DISCOVER_ADDR_RESPONSE + await getLocalIPAddress();
      // TODO - reply with the PiBot's IP address
      console.debug('TODO - reply with IP: ' + response);
    }
  });

  // On udp server started and listening.
  server.on('listening', function() {
    // Debug output - IP and port
    const address = server.address();
    console.debug(
      'UDP Discovery server started - ' + address.address + ':' + address.port,
    );
  });
}

// Exports

module.exports = {
  // Constants
  PORT_UDP_DISCOVERY,
  MSG_DISCOVER_ADDR,
  MSG_DISCOVER_ADDR_RESPONSE,
  // Functions
  allowDiscovery,
};
