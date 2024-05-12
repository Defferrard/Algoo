import {NextFunction, Request, Response} from "express";
import {GameRoomRepository} from "$/repositories";
import {GameRoom} from "@defferrard/algoo-core/src/game";
import {Service} from "typedi";

@Service()
export class GameRoomCtrl {
    constructor(
        public gameRoomRepository: GameRoomRepository
    ) {
    }

    getRooms(req: Request, res: Response, next: NextFunction) {
        res.send(this.gameRoomRepository.rooms)
    }

    createRoom(req: Request, res: Response, next: NextFunction) {
        const ROOM: GameRoom = new GameRoom();
        this.gameRoomRepository.push(ROOM);
        res.send(ROOM);
    }
}