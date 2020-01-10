import 'mocha';
import { expect } from 'chai';
import Discovery = require('../../../src/comms/discovery-service');

describe('Discovery Service', function() {
  it('should enable', function() {
    Discovery.enable();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(true);
  });

  it('should disable', function() {
    Discovery.enable();
    Discovery.disable();
    const enabled = Discovery.isEnabled();
    expect(enabled).to.equal(true);
  });
});
