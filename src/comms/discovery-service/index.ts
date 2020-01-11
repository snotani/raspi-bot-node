import dgram = require('dgram');
import net = require('net');
import { getStrAsNumberOrDefault } from '../../util/primitives';

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

let server: dgram.Socket | undefined;

/**
 * Disables Discoverable Mode on this device.
 */
export async function disable(): Promise<void> {
  return new Promise(resolve => {
    if (server === undefined) {
      console.debug('UDP Discovery - Disabled (was not running)');
      resolve();
    } else {
      server.close(() => {
        server = undefined;
        console.debug('UDP Discovery - Disabled');
        resolve();
      });
    }
  });
}

/**
 * Places the device into Discoverable Mode.
 *
 * Waits for a UDP discovery packet from a potential client, then responds with
 * a short-lived TCP connection to confirm this devices' existence and
 * willingness to connect.
 */
export function enable(): void {
  if (server === undefined) {
    // Datagram module - UDP
    server = dgram.createSocket('udp4');
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
          disable();
        });
        client.connect(PORT_TCP_RESPONSE, rinfo.address, () => {
          // No need to send message, just connect, as the connection meta data
          // (remote IP address) will be used to setup a new connection
          console.debug('UDP Discovery - Connected to requester and IP shared');
          // Cleanup after connection
          client.destroy();
          disable();
        });
      }
    });

    // On udp server started and listening.
    server.on('listening', () => {
      // Debug output - IP and port
      const address = server?.address();
      console.log(
        'UDP Discovery - Enabled - ' + address?.address + ':' + address?.port,
      );
    });
  }
}

/**
 * Checks if the Discovery Service is enabled.
 *
 * @returns {boolean} `true` if enabled, otherwise `false`.
 */
export function isEnabled(): boolean {
  return server !== undefined;
}

// Cleanup
process.on('SIGINT', () => {
  disable();
});
