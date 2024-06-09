import { v4 as uuidV4 } from 'uuid';
import {
  FullGameRoomException,
  PlayerAlreadyInGameRoomException,
} from '../exceptions/gameRoom';
import { GameManager, Player } from './index';

export enum GameRoomState {
  LOBBY,
  PLAYING,
  DONE
}

const DEFAULT_ROOM_SIZE = 2;
export default class GameRoom {
  readonly uuid: string;
  maxPlayers: number;
  #gameManager: GameManager;
  #state: GameRoomState;
  readonly players: { [key: string]: Player };  // Key = Player UUID = Team UUID
  owner?: Player;

  constructor(maxPlayers: number = DEFAULT_ROOM_SIZE, uuid: string = uuidV4()) {
    this.uuid = uuid;
    this.#state = GameRoomState.LOBBY;
    this.players = {};
    this.maxPlayers = maxPlayers;
  }

  get playersCount(): number {
    return Object.keys(this.players).length;
  }

  set state(state: GameRoomState) {
    this.#state = state;
  }

  get state(): GameRoomState {
    return this.#state;
  }

  get gameManager(): GameManager {
    return this.#gameManager;
  }

  addPlayer(player: Player): void {
    if (this.playersCount >= this.maxPlayers) {
      throw new FullGameRoomException(this.uuid);
    }
    if (this.players[player.user.uuid]) {
      throw new PlayerAlreadyInGameRoomException(player.user.uuid, this.uuid);
    }
    this.players[player.user.uuid] = player;
    if (!this.owner) {
      this.owner = player;
    }
  }

  removePlayer(uuid: string): void {
    delete this.players[uuid];
    if (this.owner?.user.uuid === uuid) {
      this.owner = Object.values(this.players)[0];
    }
  }

  getPlayer(uuid: string): Player | undefined {
    return this.players[uuid];
  }

  /**
   * Set the player ready and return true if all players are ready
   * @param uuid Player UUID
   * @param isReady Player ready state
   */
  setPlayerReady(uuid: string, isReady: boolean): boolean {
    this.players[uuid].isReady = isReady;
    return Object.values(this.players).every(player => player.isReady);
  }

  startGame(gameManager: GameManager): void {
    this.#gameManager = gameManager;
    this.state = GameRoomState.PLAYING;
  }
}
