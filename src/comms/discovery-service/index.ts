import dgram = require('dgram');
import net = require('net');

/**
 * Converts a given String into a number. If conversion is not possible,
 * it instead returns the provided default number `defaultNum`.
 *
 * @param {string | undefined} envVar A String variable to convert to a number.
 * @param {number} defaultNum A number to return as a default if `envVar` is
 *  undefined or cannot be converted to a number.
 * @returns {number} The number representation of `envVar` or the provided
 *  `defaultNum`.
 */
export function getStrAsNumberOrDefault(
  envVar: string | undefined,
  defaultNum = -1,
): number {
  // Convert to number
  const nEnvVar = Number(envVar);
  // Return if number, else undefined
  if (typeof nEnvVar === 'number' && !Number.isNaN(nEnvVar)) {
    return nEnvVar;
  } else {
    return defaultNum;
  }
}

/** Port number for the UDP Discovery service */
export const PORT_UDP_DISCOVERY: number = getStrAsNumberOrDefault(
  process.env.RPIBOT_DISCOVERY_PORT,
  8089,
);
/** Port number for the TCP response to a successful UDP Discovery */
export const PORT_TCP_RESPONSE = getStrAsNumberOrDefault(
  process.env.RPIBOT_RESPONSE_PORT,
  8090,
);
export const MSG_DISCOVER_ADDR = 'DISCOVER_PIBOT_ADDR';

/**
 * Places the device into Discoverable Mode.
 *
 * Waits for a UDP dicovery packet from a potential client, then repsonds with
 * a short-lived TCP connection to confirm this devices' existence and
 * willingness to conncect.
 */
export function allowDiscovery(): void {
  // Datagram module - UDP
  const server = dgram.createSocket('udp4');
  server.bind(PORT_UDP_DISCOVERY);

  // On udp message received
  server.on('message', (message, rinfo) => {
    if (message.toString() === MSG_DISCOVER_ADDR) {
      console.log('UDP Discovery - Discovered (' + rinfo.address + ')');
      // Respond to Discovery enquiry through a TCP socket
      const client = new net.Socket();
      client.on('error', (err: Error) => {
        console.error(err);
        console.debug('UDP Discovery - Cleaning up after error');
        client.destroy();
        server.close();
        console.log('UDP Discovery - Disabled');
      });
      client.connect(PORT_TCP_RESPONSE, rinfo.address, () => {
        // No need to send message, just connect, as the connection meta data
        // (remote IP address) will be used to setup a new connection
        console.debug('UDP Discovery - Connected to requester and IP shared');
        // Cleanup after connection
        client.destroy();
        server.close();
        console.log('UDP Discovery - Disabled');
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
