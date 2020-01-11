import 'mocha';
import { expect } from 'chai';
import Discovery = require('../../../src/comms/discovery-service');
import net = require('net');
import dgram = require('dgram');

describe('Discovery Service', function() {
  beforeEach(async function() {
    await Discovery.disable();
  });

  afterEach(async function() {
    await Discovery.disable();
  });

  it('should disable cleanly when not already enabled', async function() {
    // Discovery.disable(); will already have run in `beforeEach()`
    await Discovery.disable();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(false);
  });

  it('should enable', function() {
    Discovery.enable();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(true);
  });

  it('should disable immediately after enabling', async function() {
    Discovery.enable();
    await Discovery.disable();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(false);
  });

  it('should silently skip consecutive enable', async function() {
    Discovery.enable();
    // Enable 2nd consecutive time
    expect(() => {
      Discovery.enable();
    }).to.not.throw;
  });

  it('should respond to a Discovery UDP broadcast message', function(done) {
    Discovery.enable();

    // Create TCP server to receive a response from any discovered services
    // Created before sending the UDP message to ensure it is ready to receive a
    // response to the UDP broadcast.
    const server = new net.Server();
    server.on('error', (err: Error) => {
      console.error(err);
    });
    // Close the TCP server after no connection for predefined seconds
    const iTimeout = 1000;
    const timeoutObj = setTimeout(() => {
      // Auto-close server after 1 seconds
      server.close();
    }, iTimeout);
    // Get client IP address from connection
    server.on('connection', socket => {
      expect(socket).to.not.be.null;
      console.debug('Connection from: ' + socket.remoteAddress);
      clearTimeout(timeoutObj);
      server.close();
      done();
    });
    // Listen for discovered devices
    server.listen(Discovery.PORT_TCP_RESPONSE, '127.0.0.1');

    // Broadcast UDP discovery message
    const client = dgram.createSocket('udp4');
    const message = Discovery.MSG_DISCOVER_ADDR;
    client.send(
      message,
      0,
      message.length,
      Discovery.PORT_UDP_DISCOVERY,
      (error: Error | null) => {
        if (error) console.error(error);
        // Cleanup after send
        client.close();
      },
    );
  });
});
