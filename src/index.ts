import { CommunicationManager, CommunicationType } from './comms/comms-manager';

const comms = new CommunicationManager();
// Start connection(s)
comms.startServer(CommunicationType.Any);
// Enable discoverability service (e.g. be discoverable by UDP broadcast)
comms.startDiscoveryService();

// // Power save.
// const TIMEOUT_POWER_SAVE = 60000; // 60 secs
// setTimeout(() => {
//   comms.stopDiscoveryService();
// }, TIMEOUT_POWER_SAVE);
