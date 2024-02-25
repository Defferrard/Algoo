import {NextFunction, Response, Request} from "express";
import {gameRoomRepo} from "../repo";

export function getRooms(req: Request, res: Response, next: NextFunction) {
    res.send(gameRoomRepo.rooms)
}