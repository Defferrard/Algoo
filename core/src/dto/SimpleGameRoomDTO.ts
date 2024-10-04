import { GameRoomState } from '../game';
import { DTO } from './DTO';
import { UserDTO } from './UserDTO';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsUUID, Min, ValidateNested } from 'class-validator';

export class SimpleGameRoomDTO extends DTO {
  @IsUUID()
  uuid: string;

  @IsNumber()
  @IsPositive()
  maxPlayers: number;

  @IsNumber()
  @Min(0)
  currentPlayers: number;

  @IsEnum(GameRoomState)
  state: GameRoomState;

  @ValidateNested()
  @IsOptional()
  owner?: UserDTO;
}
