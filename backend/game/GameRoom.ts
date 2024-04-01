import {GameManager, generateRandomBoard, Team} from "@defferrard/algoo-core/src/game";
import {Player} from "./";
import {v4 as uuidV4} from "uuid";
import {User} from "@defferrard/algoo-core/src/socket";
import {FullGameRoomException} from "../exceptions/GameRoomException";
import {gameRoomRepository} from "../repositories";

enum GameRoomState{
    CREATING,
    PLAYING,
    DONE
}

const ROOM_SIZE = 2;

export default class GameRoom {
    readonly uuid: string;
    #gameManager?: GameManager;
    #state: GameRoomState;
    readonly #players: Player[]; // Player UUID -> Team UUID

    constructor(){
        this.uuid = uuidV4();
        this.#state = GameRoomState.CREATING;
        this.#players = [];
        // this._gameManager = new GameManager(generateRandomBoard(10, 10, 0.5));
    }

    get playersCount(): number {
        return this.#players.length;
    }

    get users(): User[] {
        return this.#players.map(player => player.user);
    }

    addPlayer(player: Player): void {
        if(this.playersCount >= ROOM_SIZE){
            throw new FullGameRoomException(this.uuid);
        }
        this.#players.push(player);
    }

    removePlayer(uuid: string): void {
        const index = this.#players.findIndex(player => player.user.uuid === uuid);
        if(index !== -1){
            this.#players.splice(index, 1);
        }

        if(this.playersCount === 0){
            this.#state = GameRoomState.DONE;
            gameRoomRepository.delete(this);
        }
    }
}