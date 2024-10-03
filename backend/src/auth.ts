import { JWT_SECRET } from './const';
import { UserDTO } from '@defferrard/algoo-core/src/dto';
import { User } from '@defferrard/algoo-core/src/socket';
import { Router } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

const PASSPORT_JWT_STRATEGY_ID = 'jwt';

export const router: Router = Router();
export const authenticate = passport.authenticate(PASSPORT_JWT_STRATEGY_ID, {
  session: false,
});
router.use(passport.initialize());
passport.use(
  PASSPORT_JWT_STRATEGY_ID,
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload: UserDTO, done: VerifiedCallback): Promise<void> => {
      if (payload.uuid && payload.name) {
        const USER: User = new User(payload);
        return done(null, USER);
      } else {
        return done(null, false);
      }
    },
  ),
);
