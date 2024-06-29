import { socket } from '$lib/stores/socket';
import type { GameRoomModel } from './GameRoomModel';
import { MessageType } from '@defferrard/algoo-core/src/socket';

export class GameRoomViewModel {
  private readonly _model: GameRoomModel;
  constructor(model: GameRoomModel) {
    this._model = model;
  }

  pushMessage(message: string): void {
    socket.emit(MessageType.GAME_ROOM_MESSAGE, message);
  }

  flipReady(): void {
    const isReady = this._model.flipReady();
    socket.emit(MessageType.GAME_ROOM_READY, isReady);
  }
}
