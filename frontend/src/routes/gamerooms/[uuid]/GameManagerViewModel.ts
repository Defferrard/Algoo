import { socket } from '$lib/stores/socket';
import type { GameManagerModel } from './GameManagerModel';
import type { Entity } from '@defferrard/algoo-core/src/board';
import type { HeroEntity, Resources, Spell } from '@defferrard/algoo-core/src/game';
import { isHeroEntity } from '@defferrard/algoo-core/src/game/hero/HeroEntity';
import { MessageType } from '@defferrard/algoo-core/src/socket';
import { notUndefined } from '@defferrard/algoo-core/src/utils/assertions';
import { type Writable, get, writable } from 'svelte/store';

export class GameManagerViewModel {
  private readonly _model: GameManagerModel;
  private readonly _currentSpell: Writable<Spell | undefined>;
  private readonly _targetEntity: Writable<Entity<Resources> | undefined>;
  private readonly _targetHero: Writable<HeroEntity | undefined>;
  private readonly _currentHero: Writable<HeroEntity | undefined>;

  constructor(model: GameManagerModel) {
    this._model = model;
    this._currentSpell = writable();
    this._targetEntity = writable();
    this._targetHero = writable();
    this._currentHero = writable(model.gameManager.currentHero);

    model.subscribe((newModel) => this.onModelUpdate(newModel));
  }

  nextTurn() {
    this._currentSpell.set(undefined);
    socket.emit(MessageType.NEXT_TURN);
  }

  onAction(x: number, y: number) {
    let spellIndex: number | undefined;
    const currentSpell = get(this._currentSpell);
    const currentHero = this._model.gameManager.currentHero;
    if (currentSpell && currentHero) {
      spellIndex = currentHero.spells.indexOf(currentSpell);
    }
    this._currentSpell.set(undefined);
    socket.emit(MessageType.ACTION, { x, y, spellIndex });
  }

  hover(x: number, y: number) {
    this._model.hover({ x, y });
  }

  hoverEntity(entity?: Entity<Resources>) {
    if (isHeroEntity(entity)) {
      this._targetHero.set(entity);
    } else {
      this._targetHero.set(undefined);
    }
  }

  mark(x: number, y: number) {
    this._model.mark({ x, y });
  }
  previewSpell(spellOrIndex: number | Spell) {
    const currentHero = notUndefined(this._model.gameManager.currentHero);
    if (!isHeroEntity(currentHero)) {
      return;
    }

    const spell = typeof spellOrIndex === 'number' ? currentHero.spells[spellOrIndex] : spellOrIndex;
    if (
      !spell || // if no spell is provided, cancel it
      get(this._currentSpell) === spell || // if already previewing the spell, cancel it
      !currentHero.spells.includes(spell) || // If the hero doesn't have the spell, cancel it
      !currentHero.has(spell.cost)
    ) {
      // if the hero doesn't have enough resources, cancel it
      this._currentSpell.set(undefined);
    } else {
      // this.active = this.lastHover;
      this._currentSpell.set(spell);
    }
  }
  clearHover() {
    this._model.clearHover();
  }

  get stores() {
    return {
      currentSpell: this._currentSpell,
      targetEntity: this._targetEntity,
      targetHero: this._targetHero,
      currentHero: this._currentHero,
    };
  }

  private onModelUpdate(newModel: GameManagerModel) {
    if (newModel.gameManager.currentHero !== get(this._currentHero)) {
      this._currentHero.set(newModel.gameManager.currentHero);
    }
  }
}
