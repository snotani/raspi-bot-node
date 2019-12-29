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
      console.log('UDP Discovery - Discovered');
      const ipAddr = await getLocalIPAddress();
      console.debug("This devices' IP Address: " + ipAddr);
      const response = MSG_DISCOVER_ADDR_RESPONSE + ipAddr;
      // TODO check if no need to send IP as part of the response body.
      // Respond to Discovery enquiry through a TCP socket
      const { Socket } = require('net');
      let client = new Socket();
      client.on('error', err => {
        console.error(err);
        console.debug('Cleaning up UDP Discovery Service after error');
        client.destroy();
        server.close();
        console.log('UDP Discovery - Disabled');
      });
      client.connect(PORT_TCP_RESPONSE, rinfo.address, () => {
        console.debug('UDP Discovery - Connected to requester');
        // Send response
        client.write(response, null, err => {
          if (err) {
            console.error(err);
          } else {
            console.debug('UDP Discovery - Message sent to requester');
          }
          // Cleanup after response sent
          client.destroy();
          server.close();
          console.log('UDP Discovery - Disabled');
        });
      });
    }
  });

  // On udp server started and listening.
  server.on('listening', () => {
    // Debug output - IP and port
    const address = server.address();
    console.log(
      'UDP Discovery - Enabled - ' + address.address + ':' + address.port,
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
