import { TeamDTO, buildDTO } from '@defferrard/algoo-core/src/dto';
import { GameManagerDTO } from '@defferrard/algoo-core/src/dto/GameManagerDTO';
import { teamFactory } from '@defferrard/algoo-core/src/factories/TeamFactory';
import { GameRoom, GameRoomState, Player, generateRandomBoard } from '@defferrard/algoo-core/src/game';
import { Type } from '@defferrard/algoo-core/src/utils/Type';
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
  // value: 5_000,
  value: 100,
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

  get rooms() {
    return Object.values(this._rooms);
  }

  push(room: GameRoom) {
    this._rooms[room.uuid] = room;
    this._timeouts[room.uuid] = {};
  }

  delete(uuid: string) {
    delete this._rooms[uuid];
    for (const timeout of Object.values(this._timeouts[uuid])) {
      clearTimeout(timeout);
    }
    delete this._timeouts[uuid];
  }

  get(roomUuid: string) {
    return this._rooms[roomUuid];
  }

  addPlayer(roomUuid: string, player: Player) {
    this.get(roomUuid)!.addPlayer(player);
    clearTimeout(this._timeouts[roomUuid][DELETE_ROOM_TIMEOUT.key]);
  }

  removePlayer(roomUuid: string, uuid: string) {
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

  isPlayerReady(roomUuid: string, playerUuid: string) {
    return this.get(roomUuid).getPlayer(playerUuid)?.isReady;
  }

  setPlayerReady(roomUuid: string, playerUuid: string, isReady: boolean) {
    return this.get(roomUuid).setPlayerReady(playerUuid, isReady);
  }
  setPlayerTeam(roomUuid: string, playerUuid: string, team: Type<TeamDTO>) {
    return this.get(roomUuid).setPlayerTeam(playerUuid, team);
  }

  startGame(roomUuid: string, next: (data: GameManagerDTO) => void, delay: number = START_GAME_TIMEOUT.value) {
    const gameRoom = this.get(roomUuid);
    if (!gameRoom) {
      return -1;
    }
    this._timeouts[roomUuid][START_GAME_TIMEOUT.key] = setTimeout(async () => {
      gameRoom.startGame();
      console.log(Object.values(gameRoom.players).map((player) => player.team.entities.length));
      try {
        next(
          await buildDTO(GameManagerDTO, {
            tiles: generateRandomBoard(10, 10, 0.1),
            teams: [await teamFactory(), await teamFactory()],
          }),
        );
      } catch (e: unknown) {
        console.error(JSON.stringify(e));
      }
    }, delay);
    return delay;
  }

  cancelStartGame(roomUuid: string, next: () => void) {
    if (this._timeouts[roomUuid][START_GAME_TIMEOUT.key]) {
      clearTimeout(this._timeouts[roomUuid][START_GAME_TIMEOUT.key]);
      delete this._timeouts[roomUuid][START_GAME_TIMEOUT.key];
      next();
    }
  }
}
