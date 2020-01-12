import 'mocha';
import { DCMotor } from '../../../src/movement/motors/dc';
import { DifferentialDrive } from '../../../src/movement/agents/differential-drive';
import { expect } from 'chai';
import { MovementType } from '../../../src/movement/movement-manager';

describe('Movement Agent: DifferentialDrive', function() {
  let diffDrive: DifferentialDrive;
  const leftMotor = new DCMotor(1, 2, 3);
  const rightMotor = new DCMotor(4, 5, 6);

  it('should initialise a DifferentialDrive without error', function() {
    expect(() => {
      diffDrive = new DifferentialDrive(leftMotor, rightMotor);
    }).to.not.throw(Error);
  });

  it('should Stop without error', function() {
    expect(() => {
      diffDrive.move(MovementType.Stop);
    }).to.not.throw(Error);
  });

  it('should move forward without error', function() {
    expect(() => {
      diffDrive.move(MovementType.Forward);
    }).to.not.throw(Error);
  });

  it('should move backward without error', function() {
    expect(() => {
      diffDrive.move(MovementType.Backward);
    }).to.not.throw(Error);
  });

  it('should rotate left without error', function() {
    expect(() => {
      diffDrive.move(MovementType.YawLeft);
    }).to.not.throw(Error);
  });

  it('should rotate right without error', function() {
    expect(() => {
      diffDrive.move(MovementType.YawRight);
    }).to.not.throw(Error);
  });

  it('should silently skip unsupported movement types (no errors)', function() {
    expect(() => {
      diffDrive.move(MovementType.PitchUp);
      diffDrive.move(MovementType.PitchDown);
      diffDrive.move(MovementType.RollLeft);
      diffDrive.move(MovementType.RollRight);
      diffDrive.move(MovementType.Up);
      diffDrive.move(MovementType.Down);
      diffDrive.move(MovementType.Left);
      diffDrive.move(MovementType.Right);
    }).to.not.throw(Error);
  });
});
