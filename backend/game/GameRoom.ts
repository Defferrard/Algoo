import {GameManager, generateRandomBoard, Team} from "@defferrard/algoo-core/src/game";
import {Player} from "./";
import {v4 as uuidV4} from "uuid";

enum GameRoomState{
    CREATING,
    PLAYING,
    DONE
}

export default class GameRoom {
    readonly uuid: string;
    private _gameManager?: GameManager;
    private _state: GameRoomState;
    readonly #players: Player[]; // Player UUID -> Team UUID

    constructor(){
        this.uuid = uuidV4();
        this._state = GameRoomState.CREATING;
        this.#players = [];
        // this._gameManager = new GameManager(generateRandomBoard(10, 10, 0.5));
    }

    get playersCount(): number {
        return this.#players.length;
    }

    addPlayer(player: Player): void {
        this.#players.push(player);
    }
}