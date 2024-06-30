import { On, SocketController } from '$lib/utils/socket/decorators';
import type { GameManagerModel } from './GameManagerModel';
import type { SimpleCoordinate } from '@defferrard/algoo-core/src/board';
import type { Spell } from '@defferrard/algoo-core/src/game';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import { notUndefined } from '@defferrard/algoo-core/src/utils/assertions';

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

  @On(MessageType.CAST_SPELL)
  castSpell({ x, y, spellIndex }: { x: number; y: number; spellIndex: number }) {
    const currentHero = notUndefined(this._model.gameManager.currentHero);
    this._model.castSpell(currentHero.spells[spellIndex], { x, y });
  }

  @On(MessageType.MOVE_ENTITY)
  moveEntity({ path }: { path: SimpleCoordinate[] }) {
    const currentHero = notUndefined(this._model.gameManager.currentHero);
    this._model.moveEntity(currentHero, path);
  }
}
