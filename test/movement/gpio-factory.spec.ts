import 'mocha';
import { expect } from 'chai';
import GpioFactory = require('../../src/movement/gpio-factory');
// const Gpio = GpioFactory.create();

describe('GPIO Factory', function() {
  describe('MockGPIO pin', function() {
    let sharedPin: GpioFactory.MockGPIO;

    it('should be able to create a simple pin', function() {
      sharedPin = new GpioFactory.MockGPIO(1, 'out');
      expect(sharedPin).to.be.an.instanceOf(GpioFactory.MockGPIO);
    });

    it('should read a written value (High) synchronously', function() {
      sharedPin.writeSync(1);
      const state = sharedPin.readSync();
      expect(state).to.equal(1);
    });

    it('should read a written value (Low) synchronously', function() {
      sharedPin.writeSync(0);
      const state = sharedPin.readSync();
      expect(state).to.equal(0);
    });

    it('should read a written value (High) async Promise', async function() {
      await sharedPin.write(1);
      const state = await sharedPin.read();
      expect(state).to.equal(1);
    });

    it('should read a written value (Low) async Promise', async function() {
      await sharedPin.write(0);
      const state = await sharedPin.read();
      expect(state).to.equal(0);
    });

    it('should read a written value (High) async callback', function() {
      sharedPin.write(1, () => {
        sharedPin.read((_, value) => {
          expect(value).to.equal(1);
        });
      });
    });

    it('should read a written value (Low) async callback', function() {
      sharedPin.write(0, () => {
        sharedPin.read((_, value) => {
          expect(value).to.equal(0);
        });
      });
    });
  });
});
