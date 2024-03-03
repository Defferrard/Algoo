import {GameRoom} from "../game";

export class GameRoomRepository {
    private readonly _rooms: GameRoom[];

    constructor() {
        this._rooms = [];
    }

    get rooms(): GameRoom[] {
        return [...this._rooms]
    }

    push(room: GameRoom): void {
        this._rooms.push(room);
    }
}

export default new GameRoomRepository();