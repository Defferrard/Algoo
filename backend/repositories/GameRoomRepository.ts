import {GameRoom, GameRoomState, Player} from "@defferrard/algoo-core/src/game";
import {GameRoomNotFoundException} from "@defferrard/algoo-core/src/exceptions/gameRoom";

type TimeoutConst = {
    key: string,
    value: number
}

const DELETE_ROOM_TIMEOUT: TimeoutConst = {key: "delete_room_timeout", value: 60_000};
const START_GAME_TIMEOUT: TimeoutConst = {key: "start_game_timeout", value: 10_000};

export class GameRoomRepository {
    private readonly _rooms: { [key: string]: GameRoom };
    private readonly _timeouts: { [key: string]: { [key: string]: NodeJS.Timeout } }; // 1st Key = Room UUID, 2nd Key = Timeout Type

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
        for (let timeout of Object.values(this._timeouts[uuid])) {
            clearTimeout(timeout);
        }
        delete this._timeouts[uuid];
    }

    get(roomUuid: string): GameRoom {
        let gameRoom: GameRoom | undefined = this._rooms[roomUuid];
        if (!gameRoom) throw new GameRoomNotFoundException(roomUuid);
        return gameRoom;
    }

    addPlayer(roomUuid: string, player: Player): void {
        this.get(roomUuid)!.addPlayer(player);
        clearTimeout(this._timeouts[roomUuid][DELETE_ROOM_TIMEOUT.key]);
    }

    removePlayer(roomUuid: string, uuid: string): void {
        let gameRoom: GameRoom = this.get(roomUuid);
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
        let gameRoom: GameRoom = this.get(roomUuid);
        return gameRoom.setPlayerReady(playerUuid, isReady);
    }

    startGame(roomUuid: string, next: (data: any) => void, delay: number = START_GAME_TIMEOUT.value): number {
        let gameRoom: GameRoom = this.get(roomUuid);

        this._timeouts[roomUuid][START_GAME_TIMEOUT.key] = setTimeout(() => {
            gameRoom.startGame();
            next(gameRoom.gameManager.board);
        }, delay);
        return delay;
    }
}

export default new GameRoomRepository();