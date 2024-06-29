import { On, SocketController } from '$lib/utils/socket/decorators';
import type { GameManagerModel } from './GameManagerModel';
import type { Spell } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';

@SocketController()
export default class GameManagerSocketController {
  private _model: GameManagerModel;

  constructor(model: GameManagerModel) {
    this._model = model;
  }

  @On(MessageType.NEXT_TURN)
  nextTurn() {
    this._model.nextTurn();
  }

  @On(MessageType.ACTION)
  action({ x, y, spellIndex }: { x: number; y: number; spellIndex?: number }) {
    let spell: Spell | undefined;
    const currentHero = this._model.gameManager.currentHero;
    if (spellIndex && currentHero) {
      spell = currentHero.spells[spellIndex];
    }
    this._model.onAction({ x, y }, spell);
  }
}
