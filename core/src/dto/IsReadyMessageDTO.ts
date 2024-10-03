import { MessageDTO } from './MessageDTO';
import { TeamDTO } from './TeamDTO';
import { IsBoolean, IsNotEmptyObject, ValidateNested } from 'class-validator';

export class ReadyMessageDTO extends MessageDTO {
  @IsBoolean()
  isReady: true;

  @ValidateNested()
  @IsNotEmptyObject()
  ownTeam: TeamDTO;
}

export class NotReadyMessageDTO extends MessageDTO {
  @IsBoolean()
  isReady: false;
}

export type IsReadyMessageDTO = ReadyMessageDTO | NotReadyMessageDTO;
