import { Entity } from '../board';
import { Team } from '../game';

export class TeamAlreadyExistsException extends Error {
  constructor(team: Team) {
    super(`Team ${team.uuid} already exists on the game.`);
  }
}

export class TeamNotExistsException extends Error {
  constructor(team: Team) {
    super(`Team ${team.uuid} do not exists.`);
  }
}

export class TeamNotEmptyException extends Error {
  constructor(team: Team) {
    super(`Team ${team.uuid} is not empty.`);
  }
}

export class InvalidEntityException extends Error {
  constructor(entity: Entity<any>) {
    super(`Invalid entity ${entity.uuid}.`);
  }
}
