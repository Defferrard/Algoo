import { Notify, Observable } from '$lib/utils/socket/ObservableSocketController';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
import { GameManager } from '@defferrard/algoo-core/src/game';

export class GameManagerModel extends Observable<GameManagerModel> {
  private _gameManager?: GameManager;
  protected getObservable(): GameManagerModel {
    return this;
  }

  @Notify()
  startGame(dto: GameManagerDTO): void {
    this._gameManager = new GameManager(dto);
  }
}
