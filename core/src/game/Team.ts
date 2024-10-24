import type { Entity } from '../board';
import { DTOFriendly, buildDTO } from '../dto';
import { TeamDTO } from '../dto/TeamDTO';
import { Type } from '../utils/Type';
import { Color } from './Color';
import { Resources } from './characteristics/Characteristics';
import HeroEntity from './hero/HeroEntity';

export default class Team implements DTOFriendly<TeamDTO> {
  readonly color: Color;
  readonly uuid: string;
  private readonly _entities: Entity<Resources>[];

  constructor(dto: Type<TeamDTO>) {
    this.color = dto.color;
    this.uuid = dto.uuid;
    this._entities = dto.heroes.map((hero) => new HeroEntity(hero));
    for (const entity of this._entities) {
      entity.team = this;
    }
  }

  pushEntity(entity: Entity<Resources>): void {
    if (this._entities.every((e) => e.uuid !== entity.uuid)) {
      this._entities.push(entity);
    }
  }

  deleteEntity(entity: Entity<Resources>): void {
    this._entities.splice(this._entities.indexOf(entity), 1);
  }

  equals(team: Team): boolean {
    return this.uuid === team.uuid;
  }

  get entities(): Entity<Resources>[] {
    return this._entities;
  }

  async toDTO() {
    return await buildDTO(TeamDTO, {
      color: this.color,
      uuid: this.uuid,
      heroes: [], // TODO: Include heroes
    });
  }
}
