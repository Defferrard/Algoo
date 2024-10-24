import { Color } from '../game';
import { CompleteHeroDTO } from './CompleteHeroDTO';
import { DTO } from './DTO';
import { Type } from 'class-transformer';
import { IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { v4 as uuidV4 } from 'uuid';

export class TeamDTO extends DTO {
  @IsEnum(Color)
  color: Color;

  @IsUUID()
  uuid: string = uuidV4();

  @ValidateNested({ each: true })
  @Type(() => CompleteHeroDTO)
  heroes: CompleteHeroDTO[];
}
