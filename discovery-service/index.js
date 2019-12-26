'use strict';

const PORT = process.env.RPIBOT_DISCOVERY_PORT || 8089;
const MSG_DISCOVER_ADDR = 'DISCOVER_PIBOT_ADDR';
const MSG_DISCOVER_ADDR_RESPONSE = 'PIBOT_ADDR=';

function allowDiscovery() {
  // Datagram module - UDP
  const dgram = require('dgram');
  let server = dgram.createSocket('udp4');
  server.bind(PORT);

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

// Utils

const { lookup } = require('dns').promises;
const { hostname } = require('os');

/**
 * @param {(number|Object)} [options] Optional options used by NodeJS's
 *  `dns.lookup(hostname[, options])`
 * @see https://stackoverflow.com/a/55887284/508098
 */
async function getLocalIPAddress(options) {
  return (await lookup(hostname(), options)).address;
}

// Exports

module.exports = {
  // Constants
  PORT,
  MSG_DISCOVER_ADDR,
  MSG_DISCOVER_ADDR_RESPONSE,
  // Functions
  allowDiscovery,
};
