import 'mocha';
import { expect } from 'chai';
import { getStrAsNumberOrDefault } from '../../src/util/primitives';

describe('Util: Str to Number conversion', () => {
  it('should convert "10" to 10', () => {
    const result = getStrAsNumberOrDefault('10');
    expect(result).to.equal(10);
  });

  const sNotANumber = 'word';
  it(
    `should fail to convert "${sNotANumber}" and ` +
      'return predefined default (-1)',
    () => {
      const result = getStrAsNumberOrDefault(sNotANumber);
      expect(result).to.equal(-1);
    },
  );

  it(
    'should fail to convert `undefined` and ' +
      'return predefined default (-1)',
    () => {
      const result = getStrAsNumberOrDefault(undefined);
      expect(result).to.equal(-1);
    },
  );

  const sNotANumber2 = 'fail';
  const defaultReturnValue = 123;
  it(
    `should fail to convert "${sNotANumber2}" and ` +
      `return provided default (${defaultReturnValue})`,
    () => {
      const result = getStrAsNumberOrDefault(sNotANumber2, defaultReturnValue);
      expect(result).to.equal(defaultReturnValue);
    },
  );
});
