import 'mocha';
import { expect } from 'chai';
import Discovery = require('../../../src/comms/discovery-service');
import TCP = require('../../../src/comms/net/tcp-server');

describe('Communication Manager', function() {
  after(async function() {
    await TCP.close();
    // TCP server may start Discovery Service, so double-check it's closed
    await Discovery.disable();
  });

  it('should start a TCP server', async function() {
    await TCP.start();
    const enabled = TCP.isEnabled();
    await TCP.close();
    expect(enabled).to.equal(true);
  });

  it('should stop a TCP server', async function() {
    await TCP.start();
    await TCP.close();
    const enabled = TCP.isEnabled();
    expect(enabled).to.equal(false);
  });

  it('should skip starting a 2nd TCP server', async function() {
    await TCP.start();
    await TCP.start();
    const enabled = TCP.isEnabled();
    await TCP.close();
    expect(enabled).to.equal(true);
  });

  it('should allow consecutive calls to close a TCP server', async function() {
    await TCP.close();
    await TCP.close();
    const enabled = TCP.isEnabled();
    expect(enabled).to.equal(false);
  });
});
