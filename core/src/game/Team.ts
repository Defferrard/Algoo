import type { Entity } from '../board';
import { DTOFriendly } from '../dto';
import { TeamDTO } from '../dto/TeamDTO';
import { Type } from '../utils/Type';
import { Color } from './Color';
import { Resources } from './characteristics/Characteristics';

export default class Team implements DTOFriendly<TeamDTO> {
  readonly color: Color;
  readonly uuid: string;
  private readonly _entities: Entity<Resources>[] = [];

  constructor(dto: Type<TeamDTO>) {
    this.color = dto.color;
    this.uuid = dto.uuid;
  }

  pushEntity(entity: Entity<Resources>): void {
    this._entities.push(entity);
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

  toDTO() {
    const dto = new TeamDTO();
    dto.color = this.color;
    dto.uuid = this.uuid;
    return dto;
  }
}
