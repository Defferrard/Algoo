import {Router} from 'express';
import {gameRoomCtrl as ctrl} from '../ctrl'

export const router = Router();

router.get('/', ctrl.getRooms)
router.post('/', ctrl.createRoom)