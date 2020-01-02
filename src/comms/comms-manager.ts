import Discovery = require('./discovery-service');

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
// // have a connection (e.g., UDP); these rely on a periodic keepalive message
// // and will timeout if not received.
// function addConnectionLostListener() {}

function startTCPServer(): void {
  return;
}

function startUDPServer(): void {
  return;
}

export class CommunicationManager {
  /**
   * Enables the Discovery Service.
   *
   * Responds to specific UDP broadcasts.
   *
   * @see Discovery.enable()
   */
  startDiscoveryService(): void {
    Discovery.enable();
  }

  /**
   * Disables the Discovery Service.
   *
   * @see Discovery.disable()
   */
  stopDiscoveryService(): void {
    Discovery.disable();
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
  startServer(type: CommunicationType): void {
    switch (type) {
      case CommunicationType.Any:
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
}
