import {Router} from 'express';
import {AuthCtrl} from '$/ctrl'
import {Container} from "typedi";

const ctrl: AuthCtrl = Container.get(AuthCtrl);
export const router: Router = Router();

router.post('/', ctrl.login)