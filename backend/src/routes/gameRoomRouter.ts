import {Router} from 'express';
import {GameRoomCtrl} from '$/ctrl';
import {Container} from "typedi";

const ctrl: GameRoomCtrl = Container.get(GameRoomCtrl);
export const router: Router = Router();

router.get('/', ctrl.getRooms)
router.post('/', ctrl.createRoom)