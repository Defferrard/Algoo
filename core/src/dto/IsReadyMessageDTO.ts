import { TeamDTO } from './TeamDTO';
import { TimeableDTO } from './TimeableDTO';
import { IsBoolean, IsNotEmptyObject, IsUUID, ValidateNested } from 'class-validator';

/*
 Client -> Server
*/

export class ClientReadyMessageDTO extends TimeableDTO {
  @IsBoolean()
  isReady = true as const;

  @ValidateNested()
  @IsNotEmptyObject()
  ownTeam: TeamDTO;
}

export class ClientNotReadyMessageDTO extends TimeableDTO {
  @IsBoolean()
  isReady = false as const;
}

export type ClientIsReadyMessageDTO = ClientReadyMessageDTO | ClientNotReadyMessageDTO;

/*
 Server -> Clients
*/

export class ServerReadyMessageDTO extends ClientReadyMessageDTO {
  @IsUUID()
  playerId: string;
}

export class ServerNotReadyMessageDTO extends ClientNotReadyMessageDTO {
  @IsUUID()
  playerId: string;
}
export type ServerIsReadyMessageDTO = ServerReadyMessageDTO | ServerNotReadyMessageDTO;
