import { Player } from '../game';
import { IsDate } from 'class-validator';

export class MessageDTO {
  @IsDate()
  datetime: Date;
  from: Player;
}
