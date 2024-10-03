import { DTO } from './DTO';
import { IsDateString, IsUUID } from 'class-validator';

export class MessageDTO extends DTO {
  @IsDateString()
  datetime: string;

  @IsUUID()
  playerId: string;
}
