import {GameManager, generateRandomBoard, Team} from "@defferrard/algoo-core/src/game";
import {Player} from "@defferrard/algoo-core/src/game";
import {v4 as uuidV4} from "uuid";
import {User} from "@defferrard/algoo-core/src/socket";
import {FullGameRoomException, PlayerAlreadyInGameRoomException} from "../exceptions/GameRoomException";
import {gameRoomRepository} from "../repositories";
import {clear} from "winston";

enum GameRoomState {
    CREATING,
    PLAYING,
    DONE
}

const ROOM_SIZE = 2;
const START_TIMEOUT = 10000;

export default class GameRoom {
    readonly uuid: string;
    #gameManager?: GameManager;
    #state: GameRoomState;
    readonly #players: { [key: string]: Player };  // Key = Player UUID = Team UUID

    #deleteRoomTimeout?: NodeJS.Timeout;
    #startGameTimeout?: NodeJS.Timeout;

    constructor() {
        this.uuid = uuidV4();
        this.#state = GameRoomState.CREATING;
        this.#players = {};
        // this._gameManager = new GameManager(generateRandomBoard(10, 10, 0.5));
    }

    get playersCount(): number {
        return Object.keys(this.#players).length;
    }

    get players(): Player[] {
        return Object.values(this.#players);
    }

    addPlayer(player: Player): void {
        if (this.playersCount >= ROOM_SIZE) {
            throw new FullGameRoomException(this.uuid);
        }
        if (this.#players[player.user.uuid]) {
            throw new PlayerAlreadyInGameRoomException(player.user.uuid, this.uuid);
        }
        this.#players[player.user.uuid] = player;
        clearTimeout(this.#deleteRoomTimeout);
    }

    removePlayer(uuid: string): void {
        delete this.#players[uuid];

        if (this.playersCount === 0) {
            this.#state = GameRoomState.DONE;
            this.#deleteRoomTimeout = gameRoomRepository.startTimeout(this);
        }
    }

    getPlayer(uuid: string): Player | undefined {
        return this.#players[uuid];
    }

    /**
     * Set the player ready and return true if all players are ready
     * @param uuid Player UUID
     * @param isReady Player ready state
     */
    setPlayerReady(uuid: string, isReady: boolean): boolean {
        this.#players[uuid].isReady = isReady;
        return this.players.every(player => player.isReady);
    }

    startGame(next: (data:any) => void, delay:number = START_TIMEOUT): number {
        this.#startGameTimeout = setTimeout(() => {
            this.#gameManager = new GameManager(generateRandomBoard(10, 10, 0.5));
            this.#state = GameRoomState.PLAYING;
            next(this.#gameManager.board);
        }, delay);
        return delay;
    }
}