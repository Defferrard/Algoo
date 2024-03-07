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

    delete(room: GameRoom): void {
        const index = this._rooms.indexOf(room);
        if (index !== -1) {
            this._rooms.splice(index, 1);
        }
    }
}

export default new GameRoomRepository();