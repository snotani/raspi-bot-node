import CommunicationManager = require('../comms-manager');
import net = require('net');

const HOSTNAME = 'localhost';
const PORT_TCP = 8088;

let server: net.Server | undefined;

/**
 * Close TCP Server
 */
export async function close(): Promise<void> {
  return new Promise(resolve => {
    if (server === undefined) {
      console.debug('TCP Server - Closed (already)');
      resolve();
    } else {
      server.close(() => {
        server = undefined;
        console.debug('TCP Server - Closed');
        resolve();
      });
    }
  });
}

/**
 * Start the TCP Server.
 */
export async function start(): Promise<void> {
  return new Promise(resolve => {
    if (server === undefined) {
      server = net.createServer((socket: net.Socket) => {
        // On client connection

        socket.on('error', (err: Error) => {
          console.error(err);
          socket.destroy();
        });

        // socket.on('close', (hadError: boolean) => {});

        socket.on('data', (data: Buffer) => {
          console.debug(`TCP: ${data}`);
        });
      });

      server.on('error', (err: Error) => {
        console.error(err);
        // Cleanup
        close();
        // Restart the Discovery Service
        CommunicationManager.startDiscoveryService();
      });

      server.listen(PORT_TCP, HOSTNAME, () => {
        console.debug(`TCP: server listening on ${HOSTNAME}:${PORT_TCP}`);
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Checks if the TCP server is enabled.
 *
 * @returns {boolean} `true` if enabled, otherwise `false`.
 */
export function isEnabled(): boolean {
  return server !== undefined;
}

// Cleanup
process.on('SIGINT', () => {
  close();
});
