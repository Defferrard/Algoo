import { shake } from '$lib/animations/shake';
import { showSpell } from '$lib/components/indicators/temporary_spell_indicator';
import { showValue } from '$lib/components/indicators/temporary_value_indicator';
import { ActionBuffer } from '$lib/game/index';
import { delay } from '$lib/utils/Functions';
import { SocketController } from '$lib/utils/socket/decorators';
import type { Coordinate, Entity } from '@defferrard/algoo-core/src/board';
import type { Tile } from '@defferrard/algoo-core/src/board/';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto/GameManagerDTO';
import type { Resources } from '@defferrard/algoo-core/src/game';
import { GameManager, RESSOURCES_COLOR, Spell, Team } from '@defferrard/algoo-core/src/game';
import type { ActionResume } from '@defferrard/algoo-core/src/strategy';
import type { Invalidator, Readable, Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

@SocketController()
export default class GameManagerView extends GameManager implements Readable<GameManagerView> {
  private readonly _store: Writable<GameManagerView>;
  private readonly _buffer: ActionBuffer;

  constructor(dto: GameManagerDTO) {
    super(dto);
    this._store = writable(this);
    this._buffer = new ActionBuffer();
    this._buffer.onFinished = () => this._notify();
  }

  subscribe(run: Subscriber<GameManagerView>, invalidate?: Invalidator<GameManagerView> | undefined): Unsubscriber {
    return this._store.subscribe(run, invalidate);
  }

  pushTeam(team: Team) {
    super.pushTeam(team);
    this._notify();
  }

  pushEntity(entity: Entity<Resources>, coordinate: Coordinate) {
    super.pushEntity(entity, coordinate);
    this._notify();
  }

  moveEntity(entity: Entity<Resources>, path: Coordinate[]) {
    if (this.busy) return;
    super.moveEntity(entity, path);
    this._notify();
  }

  deleteEntity(entity: Entity<Resources>) {
    super.deleteEntity(entity);
    this._notify();
  }

  castSpell(spell: Spell, coordinate: Coordinate): ActionResume[] {
    const RESUME: ActionResume[] = super.castSpell(spell, coordinate);
    const CASTER_COORDINATE: Coordinate = super.board.getEntityCoordinate(super.currentHero!);
    showSpell(CASTER_COORDINATE, spell);
    for (let resume of RESUME) {
      for (let update of resume.update!) {
        showValue(update.coordinate as Tile, update.value, RESSOURCES_COLOR[update.type]!);
        if (update.value < 0) shake(500, { x: update.value * 10, y: 0 });
      }
    }
    this._notify();

    return RESUME;
  }

  nextTurn() {
    super.nextTurn();
    this._notify();
  }

  protected moveEntityTo(entity: Entity<Resources>, coordinate: Coordinate) {
    this._buffer.add(async () => {
      super.moveEntityTo(entity, coordinate);
      this._notify();
      await delay(100);
    });
  }

  get busy() {
    return this._buffer.running;
  }

  private _notify() {
    this._store.set(this);
  }
}
