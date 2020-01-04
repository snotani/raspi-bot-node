import Comms = require('./comms/comms-manager');
import Movement = require('./movement/movement-manager');

// Start connection(s)
Comms.startServer(Comms.CommunicationType.Any);
// Enable discoverability service (e.g. be discoverable by UDP broadcast)
Comms.startDiscoveryService();

// Initialise Agent
Movement.setAgent(Movement.AgentType.DifferentialDrive);

// // Power save.
// const TIMEOUT_POWER_SAVE = 60000; // 60 seconds
// setTimeout(() => {
//   Comms.stopDiscoveryService();
// }, TIMEOUT_POWER_SAVE);
