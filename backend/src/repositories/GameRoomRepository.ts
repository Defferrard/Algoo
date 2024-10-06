import { GameManagerDTO } from '@defferrard/algoo-core/src/dto/GameManagerDTO';
import { GameRoomNotFoundException } from '@defferrard/algoo-core/src/exceptions/gameRoom';
import { GameManager, GameRoom, GameRoomState, Player, generateRandomBoard } from '@defferrard/algoo-core/src/game';
import { Service } from 'typedi';

type TimeoutConst = {
  key: string;
  value: number;
};

const DELETE_ROOM_TIMEOUT: TimeoutConst = {
  key: 'delete_room_timeout',
  value: 60_000,
};
const START_GAME_TIMEOUT: TimeoutConst = {
  key: 'start_game_timeout',
  value: 5_000,
};

@Service()
export class GameRoomRepository {
  private readonly _rooms: { [key: string]: GameRoom };
  private readonly _timeouts: {
    [key: string]: { [key: string]: NodeJS.Timeout };
  }; // 1st Key = Room UUID, 2nd Key = Timeout Type

  constructor() {
    this._rooms = {};
    this._timeouts = {};
  }

  get rooms(): GameRoom[] {
    return Object.values(this._rooms);
  }

  push(room: GameRoom): void {
    this._rooms[room.uuid] = room;
    this._timeouts[room.uuid] = {};
  }

  delete(uuid: string): void {
    delete this._rooms[uuid];
    for (const timeout of Object.values(this._timeouts[uuid])) {
      clearTimeout(timeout);
    }
    delete this._timeouts[uuid];
  }

  get(roomUuid: string): GameRoom | undefined {
    return this._rooms[roomUuid];
  }

  addPlayer(roomUuid: string, player: Player): void {
    this.get(roomUuid)!.addPlayer(player);
    clearTimeout(this._timeouts[roomUuid][DELETE_ROOM_TIMEOUT.key]);
  }

  removePlayer(roomUuid: string, uuid: string): void {
    const gameRoom = this.get(roomUuid);
    if (!gameRoom) {
      return;
    }
    gameRoom.removePlayer(uuid);

    if (gameRoom.playersCount === 0) {
      this._timeouts[roomUuid][DELETE_ROOM_TIMEOUT.key] = setTimeout(() => {
        if (gameRoom.playersCount === 0) {
          gameRoom.state = GameRoomState.DONE;
          this.delete(roomUuid);
        }
      }, DELETE_ROOM_TIMEOUT.value);
    }
  }

  setPlayerReady(roomUuid: string, playerUuid: string, isReady: boolean): boolean {
    const gameRoom = this.get(roomUuid);
    if (!gameRoom) {
      return false;
    }
    return gameRoom.setPlayerReady(playerUuid, isReady);
  }

  startGame(roomUuid: string, next: (data: any) => void, delay: number = START_GAME_TIMEOUT.value): number {
    const gameRoom = this.get(roomUuid);
    if (!gameRoom) {
      return -1;
    }
    this._timeouts[roomUuid][START_GAME_TIMEOUT.key] = setTimeout(() => {
      const dto = new GameManagerDTO();
      dto.tiles = generateRandomBoard(10, 10, 0.1);
      gameRoom.startGame();
      next(dto);
    }, delay);
    return delay;
  }

  cancelStartGame(roomUuid: string, next: () => void): void {
    if (this._timeouts[roomUuid][START_GAME_TIMEOUT.key]) {
      clearTimeout(this._timeouts[roomUuid][START_GAME_TIMEOUT.key]);
      delete this._timeouts[roomUuid][START_GAME_TIMEOUT.key];
      next();
    }
  }
}
