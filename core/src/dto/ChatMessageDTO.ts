import { MessageDTO } from './MessageDTO';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatMessageDTO extends MessageDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
