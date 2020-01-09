import CommunicationManager = require('../comms-manager');
import net = require('net');

const HOSTNAME = 'localhost';
const PORT_TCP = 8088;

let server: net.Server | undefined;

/**
 * Start the TCP Server.
 */
export function start(): void {
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
    server?.close();
    server = undefined;
    // Restart the Discovery Service
    CommunicationManager.startDiscoveryService();
  });

  server.listen(PORT_TCP, HOSTNAME, () => {
    console.debug(`TCP: server listening on ${HOSTNAME}:${PORT_TCP}`);
  });
}

/**
 * Close TCP Server
 */
export function close(): void {
  server?.close(() => {
    server = undefined;
    console.debug('TCP Server - Closed');
  });
}

// Cleanup
process.on('SIGINT', () => {
  close();
});
