import Comms = require('./comms/comms-manager');

// Start connection(s)
Comms.startServer(Comms.CommunicationType.Any);
// Enable discoverability service (e.g. be discoverable by UDP broadcast)
Comms.startDiscoveryService();

// // Power save.
// const TIMEOUT_POWER_SAVE = 60000; // 60 secs
// setTimeout(() => {
//   Comms.stopDiscoveryService();
// }, TIMEOUT_POWER_SAVE);
