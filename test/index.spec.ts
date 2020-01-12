import 'mocha';
import { expect } from 'chai';
import index = require('../src/index');
import Comms = require('../src/comms/comms-manager');

describe('Program entry point', function() {
  after(function() {
    Comms.stopServer(Comms.CommunicationType.All);
    Comms.stopDiscoveryService();
  });

  it('should initialise without error', function() {
    expect(() => {
      index.initialise();
    }).to.not.throw(Error);
  });

  it('should initialise a second time without error', function() {
    expect(() => {
      index.initialise();
    }).to.not.throw(Error);
  });
});
