import { On, SocketController } from '$lib/utils/socket/decorators';
import type { GameManagerModel } from './GameManagerModel';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
import { MessageType } from '@defferrard/algoo-core/src/socket';

@SocketController()
export default class GameManagerSocketController {
  private _model: GameManagerModel;

  constructor(model: GameManagerModel) {
    this._model = model;
  }

  @On(MessageType.GAME_ROOM_START)
  startGame(dto: GameManagerDTO): void {
    this._model.startGame(dto);
  }
}
