import {GameRoomRepository} from "$/repositories";
import {GameRoom} from "@defferrard/algoo-core/src/game";
import {Get, JsonController, Post} from "routing-controllers";
import {Service} from "typedi";

@Service()
@JsonController('/rooms')
export class GameRoomCtrl {
    constructor(
        public gameRoomRepository: GameRoomRepository
    ) {
    }

    @Get()
    getRooms(): GameRoom[] {
        return this.gameRoomRepository.rooms;
    }

    @Post()
    createRoom(): GameRoom {
        const ROOM: GameRoom = new GameRoom();
        this.gameRoomRepository.push(ROOM);
        return ROOM;
    }
}