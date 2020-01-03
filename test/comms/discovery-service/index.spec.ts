import Discovery = require('../../../src/comms/discovery-service/index');
import { expect } from 'chai';
import 'mocha';

describe('Str to Number util function', () => {
  it('should convert "10" to 10', () => {
    const result = Discovery.getStrAsNumberOrDefault('10');
    expect(result).to.equal(10);
  });
});
