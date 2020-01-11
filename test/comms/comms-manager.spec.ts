import 'mocha';
import { expect } from 'chai';
import CommunicationManager = require('../../src/comms/comms-manager');
import Discovery = require('../../src/comms/discovery-service');

describe('Communication Manager', function() {
  it('should enable Discovery Service', function() {
    CommunicationManager.startDiscoveryService();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(true);
  });

  it('should disable Discovery Service', async function() {
    await CommunicationManager.stopDiscoveryService();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(false);
  });
});
