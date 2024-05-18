import { User } from '@defferrard/algoo-core/src/socket';
import { Router } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { JWT_SECRET } from './const';


const PASSPORT_JWT_STRATEGY_ID = 'jwt';

export const router: Router = Router();
export const authenticate = passport.authenticate(PASSPORT_JWT_STRATEGY_ID, { session: false });
router.use(passport.initialize());
passport.use(PASSPORT_JWT_STRATEGY_ID, new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    passReqToCallback: true,
    
  },
  async (req, payload, done: VerifiedCallback): Promise<void> => {
    if (payload) {
      const USER: User = new User(payload.uuid, payload.name);
      return done(null, USER);
    } else {
      return done({}, false);
    }
  }));