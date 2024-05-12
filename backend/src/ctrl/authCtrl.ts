import {NextFunction, Request, Response} from "express";
import {Service} from "typedi";

@Service()
export class AuthCtrl {
    login(req: Request, res: Response, next: NextFunction) {
    }
}
