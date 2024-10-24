import { Color } from '../game/Color';
import { Resources } from '../game/characteristics/Characteristics';
import { ActionStrategy, DistanceStrategy } from '../strategy';
import { DTO } from './DTO';
import { Type } from 'class-transformer';
import { IsEnum, IsString, Length, Min, ValidateNested } from 'class-validator';

export class SpellDTO extends DTO {
  @Length(3, 20)
  name: string;
  @IsEnum(Color)
  color: Color;
  @IsString()
  iconPath: string;

  @Min(0)
  minimalRangeTarget: number;
  @Min(0)
  maximalRangeTarget: number;
  @IsEnum(DistanceStrategy)
  targetDistanceStrategy?: DistanceStrategy;

  @Min(0)
  minimalRangeAttacked: number;
  @Min(0)
  maximalRangeAttacked: number;
  @IsEnum(DistanceStrategy)
  attackedDistanceStrategy?: DistanceStrategy;

  cost: Resources;

  @ValidateNested({ each: true })
  @Type(() => SpellActionDTO)
  actions: SpellActionDTO[];
}

class SpellActionDTO {
  @IsEnum(ActionStrategy)
  type: ActionStrategy;

  args: { [key in string]: any };
}
