import { Observable } from '$lib/utils/socket/ObservableSocketController';
import type { Coordinate, Entity } from '@defferrard/algoo-core/src/board';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
import { GameManager, type Resources, Team } from '@defferrard/algoo-core/src/game';

export class GameManagerModel extends Observable<GameManagerModel> {
  private _gameManager: GameManager;

  protected getObservable(): GameManagerModel {
    return this;
  }

  constructor(dto: GameManagerDTO) {
    super();
    this._gameManager = new GameManager(dto);
  }

  pushTeam(team: Team) {
    this._gameManager.pushTeam(team);
    this.notify();
  }

  pushEntity(entity: Entity<Resources>, coordinate: Coordinate) {
    this._gameManager.pushEntity(entity, coordinate);
    this.notify();
  }

  nextTurn() {
    this._gameManager.nextTurn();
    this.notify();
  }

  get gameManager(): GameManager {
    return this._gameManager;
  }
}
