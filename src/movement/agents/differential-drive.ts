import { Agent, Motor, MovementType } from '../movement-manager';

/**
 * A two-wheeled robot.
 *
 * Two wheels connected independently to separate motors. When both motors
 * rotate the wheels in the same direction, the robot will move forward or
 * backward. To turn, the motors will rotate the wheels in opposite directions,
 * causing the robot to rotate on the spot left or right.
 */
export class DifferentialDrive implements Agent {
  leftMotor: Motor;
  rightMotor: Motor;

  constructor(leftMotor: Motor, rightMotor: Motor) {
    this.leftMotor = leftMotor;
    this.rightMotor = rightMotor;
  }

  availableMovementTypes: readonly MovementType[] = [
    MovementType.Forward,
    MovementType.Backward,
    MovementType.YawLeft,
    MovementType.YawRight,
  ];

  move(type: MovementType, value?: number): void {
    switch (type) {
      case MovementType.Forward:
        console.debug(`Move forward: ${value}`);
        break;
      case MovementType.Backward:
        console.debug(`Move backward: ${value}`);
        break;
      case MovementType.YawLeft:
        console.debug(`Rotate left: ${value}`);
        break;
      case MovementType.YawRight:
        console.debug(`Rotate right: ${value}`);
        break;
      default:
        console.warn(`MovementType ${type} not supported on this Agent`);
        break;
    }
  }
}
