import Discovery = require('./discovery-service');
import TCP = require('./net/tcp-server');

// enum MessageType {
//   // System
//   Discover = 1,
//   // Navigation (direct)
//   MoveForward = 2,
//   MoveBackward = 3,
//   MoveLeft = 3,
//   MoveRight = 4,
//   // Other
//   Pause = 5,
//   Resume = 6,
//   // Power State
//   Shutdown = 7,
// }

export enum CommunicationType {
  Any = 1,
  TCP = 2,
  UDP = 3,
  // Bluetooth = 4,
}

// type NumberCallback = (n: number) => any;

// export function addConnectionListener(): void {

// }

// // Note: There will be a potential delay for communication types that do not
// // have a connection (e.g., UDP); these rely on a periodic keep-alive message
// // and will timeout if not received.
// function addConnectionLostListener() {}

/**
 * Starts the TCP server.
 */
function startTCPServer(): void {
  TCP.start();
}

/**
 * Starts the UDP server.
 */
function startUDPServer(): void {
  return;
}

/**
 * Enables the Discovery Service.
 *
 * Responds to specific UDP broadcasts.
 *
 * @see Discovery.enable()
 */
export function startDiscoveryService(): void {
  Discovery.enable();
}

/**
 * Disables the Discovery Service.
 *
 * @see Discovery.disable()
 */
export async function stopDiscoveryService(): Promise<void> {
  return Discovery.disable();
}

/**
 * Starts the communication server(s).
 *
 * If param `type` is specified as `CommunicationType.Any`, it prepares all
 * available communication services; once a connection is established on one
 * of the communication methods, the other communication types are disabled.
 *
 * @param {CommunicationType} type The type of communication to set up.
 */
export function startServer(type: CommunicationType): void {
  switch (type) {
    case CommunicationType.Any:
      console.debug('Comms: Listening for connection on all channels');
      startTCPServer();
      startUDPServer();
      break;
    case CommunicationType.TCP:
      startTCPServer();
      break;
    case CommunicationType.UDP:
      startUDPServer();
      break;
    default:
      throw new Error(`Invalid CommunicationType: ${type}`);
  }
}
