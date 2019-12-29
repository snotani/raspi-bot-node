'use strict';

const { getLocalIPAddress } = require('../util');

/** Port number for the UDP Discovery service */
const PORT_UDP_DISCOVERY = process.env.RPIBOT_DISCOVERY_PORT || 8089;
/** Port number for the TCP response to a successful UDP Discovery */
const PORT_TCP_RESPONSE = process.env.RPIBOT_RESPONSE_PORT || 8090;
const MSG_DISCOVER_ADDR = 'DISCOVER_PIBOT_ADDR';
const MSG_DISCOVER_ADDR_RESPONSE = 'PIBOT_ADDR=';

/**
 * Places the device into Discoverable Mode.
 *
 * Waits for a UDP dicovery packet from a potential client, then repsonds with
 * a short-lived TCP connection to confirm this devices' existence and
 * willingness to conncect.
 */
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
      const ipAddr = await getLocalIPAddress();
      console.debug('This devices\' IP Address: ' + ipAddr);
      const response = MSG_DISCOVER_ADDR_RESPONSE + ipAddr;
      // Respond to Discovery enquiry through a TCP socket
      const { Socket } = require('net');
      let client = new Socket();
      // TODO migrate to async/await or Promise
      // TODO handle net connect/write exceptions
      client.connect(PORT_TCP_RESPONSE, ipAddr, function() {
        console.log('Connected to discovery enquirer');
        // Send response
        client.write(response, () => {
          console.log('Message sent to discovery enquirer');
          // Cleanup after response sent
          client.destroy();
        });
      });
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
  PORT_TCP_RESPONSE,
  MSG_DISCOVER_ADDR,
  MSG_DISCOVER_ADDR_RESPONSE,
  // Functions
  allowDiscovery,
};
