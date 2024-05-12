import {Router} from 'express';
import passport from "passport";
import {ExtractJwt, Strategy, VerifiedCallback} from "passport-jwt";
import {JWT_SECRET} from "$/const";


const PASSPORT_JWT_STRATEGY_ID = 'jwt';

export const router: Router = Router();
export const authenticate = passport.authenticate(PASSPORT_JWT_STRATEGY_ID, {session: false});
router.use(passport.initialize());
passport.use(PASSPORT_JWT_STRATEGY_ID, new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
        passReqToCallback: true,
    },
    async (req, _payload, done: VerifiedCallback): Promise<void> => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (token) {
            return done(null, {});
        } else {
            return done({}, false);
        }
    },))