import {GameRoom} from "../game";

export class GameRoomRepo {
    private readonly _rooms: GameRoom[];

    constructor() {
        this._rooms = [];
    }

    get rooms(): GameRoom[] {
        return [...this._rooms]
    }
}

export default new GameRoomRepo();