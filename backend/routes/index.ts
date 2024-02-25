import {router as gameRoomRouter} from './gameRoomRouter'
import {Router} from "express";
export const router = Router();

router.use('/gamerooms',gameRoomRouter);