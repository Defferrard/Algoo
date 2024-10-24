import { shake } from '$lib/animations/shake';
import { display, movementCost } from '$lib/components/indicators/movement_cost_indicator';
import { showSpell } from '$lib/components/indicators/temporary_spell_indicator';
import { showValue } from '$lib/components/indicators/temporary_value_indicator';
import { ActionBuffer } from '$lib/game';
import { delay } from '$lib/utils/Functions';
import { Observable } from '$lib/utils/socket/ObservableSocketController';
import { Coordinate, type Entity, type SimpleCoordinate, Tile, TileType } from '@defferrard/algoo-core/src/board';
import type { GameManagerDTO } from '@defferrard/algoo-core/src/dto';
import {
  GameManager,
  RESSOURCES_COLOR,
  ResourceType,
  type Resources,
  Spell,
  Team,
} from '@defferrard/algoo-core/src/game';
import { findPath, getAccessibles, getVisibles } from '@defferrard/algoo-core/src/pathfinding';
import type { ActionResume } from '@defferrard/algoo-core/src/strategy';
import { notUndefined } from '@defferrard/algoo-core/src/utils/assertions';

export class GameManagerModel extends Observable<GameManagerModel> {
  private _gameManager: GameManager;

  public path: SimpleCoordinate[] = []; // The path the current hero will take
  public visibles: SimpleCoordinate[] = []; // Tiles visible by the current hero
  public accessible: SimpleCoordinate[] = []; // Tiles where the current hero can move
  public targetable: SimpleCoordinate[] = []; // Tiles where the current spell can be cast
  public attacked: SimpleCoordinate[] = [];

  public active: SimpleCoordinate | undefined; // The tile the mouse is hovering
  public lastHover: SimpleCoordinate | undefined; // The last tile the mouse was hovering

  public isBusy: boolean = false; // If the game is currently processing an action

  private _castingSpell: Spell | undefined; // The spell currently being cast

  protected getObservable(): GameManagerModel {
    return this;
  }

  constructor(dto: GameManagerDTO) {
    super();
    this._gameManager = new MyGameManager(dto, () => this.notify());
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

  clearHover() {
    this.active = undefined;
    this.lastHover = undefined;
    this.notify();
  }

  hover(coordinate: SimpleCoordinate) {
    this.lastHover = new Coordinate(coordinate);
    this.clearHover();
    if (
      this.gameManager.board.getTile(coordinate).type !== TileType.Wall &&
      (this.accessible.some((c: SimpleCoordinate) => new Coordinate(coordinate).equals(c)) ||
        this.targetable.some((c: SimpleCoordinate) => new Coordinate(coordinate).equals(c)))
    ) {
      this.active = new Coordinate(coordinate);
    }
    this.notify();
  }

  castSpell(spell: Spell, coordinate: SimpleCoordinate) {
    this.gameManager.castSpell(spell, coordinate);
    this.notify();
  }

  get castingSpell(): Spell | undefined {
    return this._castingSpell;
  }

  set castingSpell(spell: Spell | undefined) {
    this._castingSpell = spell;
    this.notify();
  }

  moveEntity(entity: Entity<Resources>, path: SimpleCoordinate[]) {
    this.gameManager.moveEntity(entity, path);
    this.notify();
  }

  protected notify(): void {
    if (this.gameManager && this.gameManager.currentHero) {
      const currentHero = notUndefined(this.gameManager.currentHero);
      this.visibles = getVisibles(
        currentHero.team!.entities.map((entity: Entity<Resources>) =>
          this.gameManager.board.getEntityCoordinate(entity),
        ),
        this.gameManager.board,
      );
      if (this.isBusy) {
        this.accessible = [];
        this.targetable = [];
        this.attacked = [];
      } else if (this._castingSpell) {
        this.accessible = [];
        this.targetable = this._castingSpell.targetableTiles(
          this.gameManager.board.getEntityCoordinate(currentHero),
          this.gameManager.board,
          this.visibles,
        );
      } else {
        this.targetable = [];
        this.attacked = [];
        this.accessible = getAccessibles(
          this.gameManager.board.getEntityCoordinate(currentHero),
          currentHero.resources[ResourceType.STAMINA],
          this.gameManager.board,
          this.visibles,
        );
      }
      const active = this.active;
      if (
        active &&
        !Coordinate.equals(active, this.gameManager.board.getEntityCoordinate(currentHero)) &&
        this.accessible.some((otherCoordinate) => Coordinate.equals(otherCoordinate, active))
      ) {
        const lastTile = this.path[this.path.length - 1];
        const currentHeroPosition = this.gameManager.board.getEntityCoordinate(currentHero);
        if (lastTile && !Coordinate.isNeighbor(lastTile, currentHeroPosition)) {
          this.path = findPath(
            this.gameManager.board.getEntityCoordinate(currentHero),
            active,
            this.gameManager.board,
            this.accessible,
          );
        } else if (this.path.some((otherCoordinate) => Coordinate.equals(otherCoordinate, active))) {
          // If the path makes a loop, cut it to the active tile
          while (!Coordinate.equals(this.path[0], active)) {
            this.path.shift();
          }
        } else if (
          this.path.length > 0 &&
          Coordinate.getNeighbors(active).some((n) => Coordinate.equals(n, this.path[0])) &&
          this.gameManager.board.getPathCost(this.path) + this.gameManager.board.getTile(active).movementCost! <=
            currentHero.resources[ResourceType.STAMINA]
        ) {
          // If the active tile is simply a neighbor of the first tile of the path, add it to the path
          this.path = [active, ...this.path];
        } else {
          // Otherwise, find the new shortest path
          this.path = findPath(
            this.gameManager.board.getEntityCoordinate(this.gameManager.currentHero!),
            active,
            this.gameManager.board,
            this.accessible,
          );
        }
        movementCost.set(this.gameManager.board.getPathCost(this.path));

        display.set(this.path.length > 0);
      } else if (active && this.targetable.some((otherCoordinate) => Coordinate.equals(otherCoordinate, active))) {
        this.path = [];
        // this.attacked =
        //   this.currentSpell?.attackedTiles(
        //     this.gameManager.board.getEntityCoordinate(currentHero),
        //     active,
        //     this.gameManager.board,
        //   ) || [];
        movementCost.set(0);
        display.set(false);
      } else {
        this.active = undefined;
        this.attacked = [];
        this.path = [];
        movementCost.set(0);
        display.set(false);
      }
    }
    super.notify();
  }

  get gameManager(): GameManager {
    return this._gameManager;
  }
}

class MyGameManager extends GameManager {
  private readonly _buffer: ActionBuffer;
  private readonly _notify: () => void;
  constructor(dto: GameManagerDTO, notify?: () => void) {
    super(dto);
    this._buffer = new ActionBuffer();
    this._notify = notify || (() => {});
    this._buffer.onFinished = () => this._notify();
  }

  moveEntity(entity: Entity<Resources>, path: Coordinate[]) {
    if (this.busy) return;
    super.moveEntity(entity, path);
  }

  castSpell(spell: Spell, coordinate: Coordinate): ActionResume[] {
    const RESUME: ActionResume[] = super.castSpell(spell, coordinate);
    const CASTER_COORDINATE: SimpleCoordinate = super.board.getEntityCoordinate(super.currentHero!);
    showSpell(CASTER_COORDINATE, spell);
    for (const resume of RESUME) {
      for (const update of resume.update!) {
        showValue(update.coordinate as Tile, update.value, RESSOURCES_COLOR[update.type]!);
        if (update.value < 0) shake(500, { x: update.value * 10, y: 0 });
      }
    }
    this._notify();

    return RESUME;
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
}
