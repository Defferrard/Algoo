import {router as gameRoomRouter} from './gameRoomRouter'
import {router as authRouter} from './authRouter'
import {Router} from "express";

export const router: Router = Router();

router.use('/gamerooms', gameRoomRouter);
router.use('/auth', authRouter);