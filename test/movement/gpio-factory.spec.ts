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

    it('should read 5 consecutive written GPIO pins', async function() {
      const pin1 = new GpioFactory.MockGPIO(1, 'out');
      const pin2 = new GpioFactory.MockGPIO(2, 'out');
      const pin3 = new GpioFactory.MockGPIO(3, 'out');
      const pin4 = new GpioFactory.MockGPIO(4, 'out');
      const pin5 = new GpioFactory.MockGPIO(5, 'out');
      GpioFactory.writeMultiplePins(0, pin1, pin2, pin3, pin4, pin5);
      let count = 0;
      count += await pin1.read();
      count += await pin2.read();
      count += await pin3.read();
      count += await pin4.read();
      count += await pin5.read();
      GpioFactory.writeMultiplePins(1, pin1, pin2, pin3, pin4, pin5);
      count += await pin1.read();
      count += await pin2.read();
      count += await pin3.read();
      count += await pin4.read();
      count += await pin5.read();
      expect(count).to.equal(5);
    });
  });
});
