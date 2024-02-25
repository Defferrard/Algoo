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
    private readonly _players: Player[]; // Player UUID -> Team UUID

    constructor(owner: Player){
        this.uuid = uuidV4();
        this._state = GameRoomState.CREATING;
        this._players = [owner];
        // this._gameManager = new GameManager(generateRandomBoard(10, 10, 0.5));
    }
}