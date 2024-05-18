import {
    GameRoom,
    GameRoomState,
    Player,
} from '@defferrard/algoo-core/src/game';
import type {
    Invalidator,
    Readable,
    Subscriber,
    Unsubscriber,
    Updater,
} from 'svelte/store';
import { writable } from 'svelte/store';
import { v4 as uuidV4 } from 'uuid';

const DEFAULT_ROOM_SIZE = 2;
export default class GameRoomReadable extends GameRoom implements Readable<GameRoom> {
  private set(this: void, value: GameRoom): void {
    throw new Error('Method not implemented.');
  }

  private update(this: void, updater: Updater<GameRoom>): void {
    throw new Error('Method not implemented.');
  }

  subscribe(run: Subscriber<GameRoom>, invalidate?: Invalidator<GameRoom>): Unsubscriber {
    throw new Error('Method not implemented.');
  }

  constructor(maxPlayers: number = DEFAULT_ROOM_SIZE, uuid: string = uuidV4()) {
    super(maxPlayers, uuid);
    const { subscribe, set, update } = writable(this);
    this.update = update;
    this.set = set;
    this.subscribe = subscribe;
  }


  set state(state: GameRoomState) {
    super.state = state;
    this.set(this);
  }

  get state(): GameRoomState {
    return super.state;
  }

  addPlayer(player: Player) {
    super.addPlayer(player);
    this.set(this);
  }

  removePlayer(uuid: string) {
    super.removePlayer(uuid);
    this.set(this);
  }

  setPlayerReady(uuid: string, isReady: boolean): boolean {
    const res = super.setPlayerReady(uuid, isReady);
    this.set(this);
    return res;
  }

  startGame() {
    super.startGame();
    this.set(this);
  }
}