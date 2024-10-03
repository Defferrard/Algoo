import { localUser } from '$lib/stores/localUser';
import { socket } from '$lib/stores/socket';
import type { GameRoomModel } from './GameRoomModel';
import {
  ChatMessageDTO,
  type IsReadyMessageDTO,
  NotReadyMessageDTO,
  ReadyMessageDTO,
  TeamDTO,
} from '@defferrard/algoo-core/src/dto';
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

  flipReady() {
    const isReady = this._model.flipReady();
    let dto: IsReadyMessageDTO;
    if (isReady) {
      dto = new ReadyMessageDTO();
      dto.ownTeam = { a: 'A' } as any;
    } else {
      dto = new NotReadyMessageDTO();
    }
    dto.isReady = isReady;
    dto.datetime = new Date().toISOString();
    dto.playerId = get(localUser).uuid;
    socket.emit(MessageType.GAME_ROOM_READY, dto);
  }
}
