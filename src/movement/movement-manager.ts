import { DCMotor } from './motors/dc';
import { DifferentialDrive } from './agents/differential-drive';

export enum AgentType {
  DifferentialDrive,
}

export enum MovementType {
  Stop = 0,
  // Direction
  Up = 1, // Vertical up
  Down = 2, // Vertical down
  Forward = 3, // Longitudinal forward
  Backward = 4, // Longitudinal back
  Left = 5, // Lateral left
  Right = 6, // Lateral right
  // Rotations
  PitchUp = 7, // Front up
  PitchDown = 8, // Front down
  RollLeft = 9, // Left down, right up
  RollRight = 10, // Left up, right down
  YawLeft = 11, // Front rotate left
  YawRight = 12, // Front rotate right
}

export enum MotorMotionType {
  Stop = 0,
  Clockwise = 1,
  CounterClockwise = 2,
}

/**
 * An `Agent` organises and controls the sensors and actuators of a robot.
 *
 * @typedef {object} Agent
 * @property {MovementType[]} availableMovementTypes The `MovementType`s
 *  supported by this `Agent`.
 * @property {Function} move Moves the robot.
 */
export type Agent = {
  /**
   * List of the available `MovementType` supported by this `Agent`.
   * Can be used to, e.g., determine which UI features to enable/disable.
   */
  availableMovementTypes: ReadonlyArray<MovementType>;

  /**
   * Moves the robot.
   *
   * @param {MovementType} type The type of movement the robot should do.
   * @param {number} [value] Additional movement value. Can specify how much
   *  the robot moves.
   */
  move(type: MovementType, value?: number): void;
};

export interface Motor {
  getCurrentState(): MotorMotionType;

  stop(): void;

  clockwise(): void;

  counterClockwise(): void;
}

let agent: Agent;

/**
 * Initialises the robot for the given `AgentType` configuration.
 *
 * @param {AgentType} type The type of `Agent` (robot) to initialise.
 * @returns {Agent} The `Agent` (robot) instance that has been initialised.
 */
export function setAgent(type: AgentType): Agent {
  switch (type) {
    case AgentType.DifferentialDrive:
      agent = new DifferentialDrive(
        new DCMotor(-1, -2, -3),
        new DCMotor(-4, -5, -6),
      );
      break;
    default:
      throw new Error(`AgentType not yet supported: ${type}`);
  }
  return agent;
}
