import { TimeableDTO } from './TimeableDTO';
import { IsUUID } from 'class-validator';

export class MessageDTO extends TimeableDTO {
  @IsUUID()
  playerId: string;
}
