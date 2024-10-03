import { socket } from '$lib/stores/socket';
import { delay } from '$lib/utils/Functions';
import type { GameManagerModel } from './GameManagerModel';
import { Coordinate, type Entity, type SimpleCoordinate } from '@defferrard/algoo-core/src/board';
import { CastSpellDTO, MoveEntityDTO } from '@defferrard/algoo-core/src/dto';
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
  private readonly _markers: Writable<SimpleCoordinate[]>; // Tiles marked by the user

  constructor(model: GameManagerModel) {
    this._model = model;
    this._currentSpell = writable();
    this._targetEntity = writable();
    this._targetHero = writable();
    this._currentHero = writable(model.gameManager.currentHero);
    this._markers = writable([]);

    model.subscribe((newModel) => this.onModelUpdate(newModel));
    this._currentSpell.subscribe((spell) => {
      this._model.castingSpell = spell;
    });
  }

  nextTurn() {
    this._currentSpell.set(undefined);
    socket.emit(MessageType.NEXT_TURN);
  }

  onAction(x: number, y: number) {
    const currentSpell = get(this._currentSpell);
    const currentHero = notUndefined(this._model.gameManager.currentHero);
    if (currentSpell) {
      let spellIndex = currentHero.spells.indexOf(currentSpell);
      const dto = new CastSpellDTO();
      dto.spellId = spellIndex;
      dto.target = Coordinate.toDTO({ x, y });
      socket.emit(MessageType.CAST_SPELL, dto);
    } else {
      const dto = new MoveEntityDTO();
      dto.uuid = currentHero.uuid;
      dto.path = this._model.path.map((coordinate) => Coordinate.toDTO(coordinate));
      socket.emit(MessageType.MOVE_ENTITY, dto);
    }
    this._currentSpell.set(undefined);
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

  async mark(x: number, y: number) {
    const coordinate = { x, y };
    this._markers.update((markers) => [...markers, coordinate]);
    await delay(5000);
    this._markers.update((markers) =>
      markers.filter((otherCoordinate) => !Coordinate.equals(otherCoordinate, coordinate)),
    );
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
      markers: this._markers,
    };
  }

  private onModelUpdate(newModel: GameManagerModel) {
    if (newModel.gameManager.currentHero !== get(this._currentHero)) {
      this._currentHero.set(newModel.gameManager.currentHero);
    }
  }
}
