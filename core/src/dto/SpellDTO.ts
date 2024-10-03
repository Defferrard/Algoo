import { Color } from '../game/Color';
import { Resources } from '../game/characteristics/Characteristics';
import { ActionStrategy, DistanceStrategy } from '../strategy';
import { DTO } from './DTO';
import { IsDataURI, IsEnum, IsPositive, Length, ValidateNested } from 'class-validator';

export class SpellDTO extends DTO {
  @Length(3, 20)
  name: string;
  @IsEnum(Color)
  color: Color;
  @IsDataURI()
  iconPath: string;

  @IsPositive()
  minimalRangeTarget: number;
  @IsPositive()
  maximalRangeTarget: number;
  @IsEnum(DistanceStrategy)
  targetDistanceStrategy?: DistanceStrategy;

  @IsPositive()
  minimalRangeAttacked: number;
  @IsPositive()
  maximalRangeAttacked: number;
  @IsEnum(DistanceStrategy)
  attackedDistanceStrategy?: DistanceStrategy;

  cost: Resources;

  @ValidateNested({ each: true })
  actions: SpellActionDTO[];
}

class SpellActionDTO {
  @IsEnum(ActionStrategy)
  type: ActionStrategy;

  args: { [key in string]: unknown };
}
