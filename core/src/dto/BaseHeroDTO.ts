import { Stance, StandardResources } from '../game';
import { UuidDTO } from './UuidDTO';
import { IsEnum, Length } from 'class-validator';

export class BaseHeroDTO extends UuidDTO {
  @Length(3, 20)
  name: string;
  @Length(3, 20)
  title: string;

  characteristics: StandardResources & {
    strength: number;
    resistance: number;
    durability: number;
  };

  @IsEnum(Stance, { each: true })
  stance: Stance;
}
