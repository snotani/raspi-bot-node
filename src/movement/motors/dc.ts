/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint rule `@typescript-eslint/no-explicit-any`is disabled due to
// inability to load types for onoff.
import { Motor } from '../movement-manager';
const Gpio = require('onoff').Gpio;

export class DCMotor implements Motor {
  gpioPinA: any;
  gpioPinB: any;
  gpioPinEn: any;

  constructor(gpioPinA: number, gpioPinB: number, gpioPinEn: number) {
    this.gpioPinA = new Gpio(gpioPinA, 'out');
    this.gpioPinB = new Gpio(gpioPinB, 'out');
    this.gpioPinEn = new Gpio(gpioPinEn, 'out');
    // Cleanup
    process.on('SIGINT', _ => {
      this.gpioPinA.unexport();
      this.gpioPinB.unexport();
      this.gpioPinEn.unexport();
    });
  }

  stop(): void {
    // Disable the motor first to maximise conserved power.
    this.gpioPinEn.writeSync(0);
    // Stop sending a signal to the remaining pins.
    this.gpioPinA.writeSync(0);
    this.gpioPinB.writeSync(0);
  }

  clockwise(): void {
    this.gpioPinA.writeSync(1);
    this.gpioPinB.writeSync(0);
    this.gpioPinEn.writeSync(1);
  }

  counterClockwise(): void {
    this.gpioPinA.writeSync(0);
    this.gpioPinB.writeSync(1);
    this.gpioPinEn.writeSync(1);
  }
}
