import { localUser } from '$lib/stores/localUser';
import { socket } from '$lib/stores/socket';
import type { GameRoomModel } from './GameRoomModel';
import {
  ChatMessageDTO,
  type ClientIsReadyMessageDTO,
  ClientNotReadyMessageDTO,
  ClientReadyMessageDTO,
  buildDTO,
} from '@defferrard/algoo-core/src/dto';
import { teamFactory } from '@defferrard/algoo-core/src/factories/TeamFactory';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import { get } from 'svelte/store';

export class GameRoomViewModel {
  private readonly _model: GameRoomModel;
  constructor(model: GameRoomModel) {
    this._model = model;
  }

  pushMessage(message: string) {
    const dto = new ChatMessageDTO();
    dto.message = message;
    dto.datetime = new Date().toISOString();
    dto.playerId = get(localUser).uuid;
    socket.emit(MessageType.GAME_ROOM_MESSAGE, dto);
  }

  async flipReady() {
    const isReady = this._model.flipReady();
    let dto: ClientIsReadyMessageDTO;
    if (isReady) {
      dto = await buildDTO(ClientReadyMessageDTO, {
        ownTeam: await teamFactory(),
      });
    } else {
      dto = await buildDTO(ClientNotReadyMessageDTO, {});
    }
    socket.emit(MessageType.GAME_ROOM_READY, dto);
  }
}
