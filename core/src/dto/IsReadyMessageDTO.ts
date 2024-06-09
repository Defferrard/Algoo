import { MessageDTO } from './MessageDTO';
import { IsBoolean } from 'class-validator';

export class IsReadyMessageDTO extends MessageDTO {
  @IsBoolean()
  isReady: boolean;
}
