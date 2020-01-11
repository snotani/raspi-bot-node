import 'mocha';
import { expect } from 'chai';
import MovementManager = require('../../src/movement/movement-manager');

describe('Movement Manager', function() {
  it('should set Agent to a DifferentialDrive', async function() {
    const agent = MovementManager.setAgent(
      MovementManager.AgentType.DifferentialDrive,
    );
    expect(agent).to.be.an('object');
  });
});
