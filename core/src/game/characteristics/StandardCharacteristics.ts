import { Characteristics, Resources } from './Characteristics';
import { ResourceType } from './ResourceType';

export type StandardResources = Resources & { [ResourceType.HEALTH]: number; [ResourceType.STAMINA]: number };

export class StandardCharacteristics extends Characteristics<StandardResources> {
  readonly strength: number;
  readonly resistance: number;
  readonly durability: number;

  constructor(maxResources: StandardResources, strength: number, resistance: number, durability: number) {
    super(maxResources);
    this.strength = strength;
    this.resistance = resistance;
    this.durability = durability;
  }
}
