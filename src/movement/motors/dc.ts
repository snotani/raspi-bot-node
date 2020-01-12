/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint rule `@typescript-eslint/no-explicit-any`is disabled due to
// inability to load types for onoff.
import { Motor } from '../movement-manager';
import { MotorMotionType } from '../movement-manager';
import GpioFactory = require('../gpio-factory');
const Gpio = GpioFactory.create();

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
    GpioFactory.writeMultiplePins(
      0,
      this.gpioPinEn,
      this.gpioPinA,
      this.gpioPinB,
    );
    this.currentMotionType = MotorMotionType.Stop;
  }

  clockwise(): void {
    this.gpioPinB.writeSync(0);
    GpioFactory.writeMultiplePins(1, this.gpioPinA, this.gpioPinEn);
    this.currentMotionType = MotorMotionType.Clockwise;
  }

  counterClockwise(): void {
    this.gpioPinA.writeSync(0);
    GpioFactory.writeMultiplePins(1, this.gpioPinB, this.gpioPinEn);
    this.currentMotionType = MotorMotionType.CounterClockwise;
  }
}
