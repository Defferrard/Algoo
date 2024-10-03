import { GameRoomState } from '../game';
import { DTO } from './DTO';
import { UserDTO } from './UserDTO';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from 'class-validator';

export class SimpleGameRoomDTO extends DTO {
  @IsUUID()
  uuid: string;

  @IsNumber()
  @IsPositive()
  maxPlayers: number;

  @IsNumber()
  @IsPositive()
  currentPlayers: number;

  @IsEnum(GameRoomState)
  state: GameRoomState;

  @ValidateNested()
  @IsOptional()
  owner?: UserDTO;
}
