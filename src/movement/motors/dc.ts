/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint rule `@typescript-eslint/no-explicit-any`is disabled due to
// inability to load types for onoff.
import { Motor } from '../movement-manager';
import { MotorMotionType } from '../movement-manager';
const Gpio = require('../gpio-factory').create();

export class DCMotor implements Motor {
  gpioPinA: any;
  gpioPinB: any;
  gpioPinEn: any;

  currentMotionType: MotorMotionType;

  constructor(gpioPinA: number, gpioPinB: number, gpioPinEn: number) {
    this.gpioPinA = new Gpio(gpioPinA, 'out');
    this.gpioPinB = new Gpio(gpioPinB, 'out');
    this.gpioPinEn = new Gpio(gpioPinEn, 'out');
    // Cleanup
    process.on('SIGINT', () => {
      this.gpioPinA.unexport();
      this.gpioPinB.unexport();
      this.gpioPinEn.unexport();
    });
    // Ensure Motor starts in a stopped state
    this.gpioPinEn.writeSync(0);
    // Cache the state
    this.currentMotionType = MotorMotionType.Stop;
  }

  getCurrentState(): MotorMotionType {
    return this.currentMotionType;
  }

  stop(): void {
    // Disable the motor first to maximise conserved power.
    this.gpioPinEn.writeSync(0);
    // Stop sending a signal to the remaining pins.
    this.gpioPinA.writeSync(0);
    this.gpioPinB.writeSync(0);
    // Cache the state
    this.currentMotionType = MotorMotionType.Stop;
  }

  clockwise(): void {
    this.gpioPinA.writeSync(1);
    this.gpioPinB.writeSync(0);
    this.gpioPinEn.writeSync(1);
    // Cache the state
    this.currentMotionType = MotorMotionType.Clockwise;
  }

  counterClockwise(): void {
    this.gpioPinA.writeSync(0);
    this.gpioPinB.writeSync(1);
    this.gpioPinEn.writeSync(1);
    // Cache the state
    this.currentMotionType = MotorMotionType.CounterClockwise;
  }
}
