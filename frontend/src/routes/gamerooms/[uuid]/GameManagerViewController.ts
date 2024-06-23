import type { GameManagerModel } from './GameManagerModel';

export class GameManagerViewController {
  private readonly _model: GameManagerModel;
  constructor(model: GameManagerModel) {
    this._model = model;
  }

  get isBusy(): boolean {
    return false;
  }
}
