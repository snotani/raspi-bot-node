import 'mocha';
import { DCMotor } from '../../../src/movement/motors/dc';
import { DifferentialDrive } from '../../../src/movement/agents/differential-drive';
import { expect } from 'chai';
import { MovementType } from '../../../src/movement/movement-manager';

describe('Movement Agent: DifferentialDrive', () => {
  let diffDrive: DifferentialDrive;

  it('should initialise a DifferentialDrive without error', () => {
    expect(() => {
      diffDrive = new DifferentialDrive(
        new DCMotor(1, 2, 3),
        new DCMotor(4, 5, 6),
      );
    }).to.not.throw(Error);
  });

  it('should Stop without error', () => {
    expect(() => {
      diffDrive.move(MovementType.Forward);
    }).to.not.throw(Error);
  });
});
