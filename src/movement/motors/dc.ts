/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint rule `@typescript-eslint/no-explicit-any`is disabled due to
// inability to load `pigpio` and `pigpio-mock` modules' types.
import { Motor } from '../movement-manager';
const Gpio = false ? require('pigpio').Gpio : require('pigpio-mock').Gpio;
// TODO Check `pigpio` dependency: www.npmjs.com/package/pigpio#installation

export class DCMotor implements Motor {
  gpioPinA: any;
  gpioPinB: any;
  gpioPinEn: any;

  constructor(gpioPinA: number, gpioPinB: number, gpioPinEn: number) {
    this.gpioPinA = new Gpio(gpioPinA, { mode: Gpio.OUTPUT });
    this.gpioPinB = new Gpio(gpioPinB, { mode: Gpio.OUTPUT });
    this.gpioPinEn = new Gpio(gpioPinEn, { mode: Gpio.OUTPUT });
  }

  stop(): void {
    // Disable the motor first to maximise conserved power.
    this.gpioPinEn.digitalWrite(0);
    // Stop sending a signal to the remaining pins.
    this.gpioPinA.digitalWrite(0);
    this.gpioPinB.digitalWrite(0);
  }

  clockwise(): void {
    this.gpioPinA.digitalWrite(1);
    this.gpioPinB.digitalWrite(0);
    this.gpioPinEn.digitalWrite(1);
  }

  counterClockwise(): void {
    this.gpioPinA.digitalWrite(0);
    this.gpioPinB.digitalWrite(1);
    this.gpioPinEn.digitalWrite(1);
  }
}
