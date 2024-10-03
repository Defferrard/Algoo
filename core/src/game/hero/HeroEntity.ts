import Entity from '../../board/Entity';
import { CompleteHeroDTO } from '../../dto/CompleteHeroDTO';
import Effect from '../Effect';
import { Resources } from '../characteristics/Characteristics';
import { ResourceType } from '../characteristics/ResourceType';
import { StandardCharacteristics, StandardResources } from '../characteristics/StandardCharacteristics';
import Spell from '../spell/Spell';
import { Stance } from './Stance';

export function isHeroEntity(entity?: Entity<Resources>): entity is HeroEntity {
  return (
    entity !== undefined &&
    (entity as HeroEntity).name !== undefined &&
    (entity as HeroEntity).title !== undefined &&
    (entity as HeroEntity).characteristics !== undefined &&
    (entity as HeroEntity).spells !== undefined &&
    (entity as HeroEntity).effects !== undefined &&
    (entity as HeroEntity).stance !== undefined
  );
}

export default class HeroEntity extends Entity<StandardResources> {
  readonly name: string;
  readonly title: string;
  readonly characteristics: StandardCharacteristics;
  readonly spells: Spell[];
  readonly effects: Effect[];
  stance: Stance;

  constructor(dto: CompleteHeroDTO) {
    super(dto.characteristics);

    // TODO : Can we simplify ? (Can we generate maxResources dynamically from dto.characteristics ?)
    const CHARACTERISTICS: StandardCharacteristics = new StandardCharacteristics(
      {
        [ResourceType.HEALTH]: dto.characteristics[ResourceType.HEALTH],
        [ResourceType.STAMINA]: dto.characteristics[ResourceType.STAMINA],
      },
      dto.characteristics.strength,
      dto.characteristics.resistance,
      dto.characteristics.durability,
    );

    this.name = dto.name;
    this.title = dto.title;
    this.characteristics = CHARACTERISTICS;
    this.spells = dto.spells.map((spell) => new Spell(spell));
    this.effects = [];
    this.stance = dto.stance;
  }

  onEndTurn() {
    this.resources[ResourceType.STAMINA]! += this.characteristics.durability;
    this.resources[ResourceType.STAMINA] = Math.min(
      this.resources[ResourceType.STAMINA]!,
      this.characteristics.max[ResourceType.STAMINA]!,
    );
  }

  updateResource(type: ResourceType, updateFunction: (value: number) => number): number {
    const OLD_VALUE = this.resources[type]!;
    super.updateResource(type, updateFunction);
    if (this.resources[type]! > this.characteristics.max[type]!) {
      this.resources[type] = this.characteristics.max[type]!;
    }
    return this.resources[type]! - OLD_VALUE;
  }
}
