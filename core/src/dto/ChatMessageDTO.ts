import { MessageDTO } from './MessageDTO';
import { IsString } from 'class-validator';

export class ChatMessageDTO extends MessageDTO {
  @IsString()
  message: string;
}
