import type { Resources } from '../game';
import { Team } from '../game';
import type { ResourceType } from '@defferrard/algoo-core/src/game/';
import { v4 as uuidV4 } from 'uuid';

/**
 * An entity is an object that can be placed on the board.
 */
export default class Entity<R extends Resources> {
  readonly uuid: string = uuidV4();
  readonly resources: R;

  floor: boolean = false; // TODO
  playable: boolean = false; // TODO
  team?: Team;

  constructor(resources: R) {
    this.resources = resources;
  }

  updateResource(type: ResourceType, updateFunction: (value: number) => number): number {
    const OLD_VALUE = this.resources[type]!;
    this.resources[type] = updateFunction(this.resources[type]!);

    if (this.resources[type]! < 0) {
      this.resources[type] = 0;
    }
    return this.resources[type]! - OLD_VALUE;
  }

  pay(resources: Resources): boolean {
    if (!this.has(resources)) {
      return false;
    }
    Object.keys(resources).forEach((resourceType) => {
      const type: ResourceType = resourceType as ResourceType;
      this.resources[type]! -= resources[type]!;
    });
    return true;
  }

  has(resources: Resources): boolean {
    return Object.keys(resources).every((resourceType: string) => {
      const type: ResourceType = resourceType as ResourceType;
      return this.resources[type]! >= resources[type]!;
    });
  }
}
