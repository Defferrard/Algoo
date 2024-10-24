import { TeamDTO } from './TeamDTO';
import { TimeableDTO } from './TimeableDTO';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, ValidateNested } from 'class-validator';

/*
 Client -> Server
*/

class ReadyMessageDTO extends TimeableDTO {
  @IsBoolean()
  isReady = true as const;
}
export class ClientReadyMessageDTO extends ReadyMessageDTO {
  @ValidateNested()
  @Type(() => TeamDTO)
  ownTeam: TeamDTO;
}

class NotReadyMessageDTO extends TimeableDTO {
  @IsBoolean()
  isReady = false as const;
}
export class ClientNotReadyMessageDTO extends NotReadyMessageDTO {}

export type ClientIsReadyMessageDTO = ClientReadyMessageDTO | ClientNotReadyMessageDTO;

/*
 Server -> Clients
*/

export class ServerReadyMessageDTO extends ReadyMessageDTO {
  @IsUUID()
  playerId: string;
}

export class ServerNotReadyMessageDTO extends NotReadyMessageDTO {
  @IsUUID()
  playerId: string;
}
export type ServerIsReadyMessageDTO = ServerReadyMessageDTO | ServerNotReadyMessageDTO;
