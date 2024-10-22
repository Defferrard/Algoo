import { TeamDTO } from './TeamDTO';
import { TimeableDTO } from './TimeableDTO';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { v4 as uuid } from 'uuid';

/*
 Client -> Server
*/

export class ClientReadyMessageDTO extends TimeableDTO {
  @IsBoolean()
  isReady = true as const;

  @ValidateNested()
  @Type(() => TeamDTO)
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
  playerId: string = uuid();
}

export class ServerNotReadyMessageDTO extends ClientNotReadyMessageDTO {
  @IsUUID()
  playerId: string = uuid();
}
export type ServerIsReadyMessageDTO = ServerReadyMessageDTO | ServerNotReadyMessageDTO;
