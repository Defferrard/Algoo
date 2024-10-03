import { User } from '@defferrard/algoo-core/src/socket';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import { JWT_SECRET } from '~/const';

@Service()
export class AuthService {
  signIn(username: string) {
    const user = new User({ uuid: uuid(), name: username });
    return jwt.sign({ ...user }, JWT_SECRET, { expiresIn: '1h' });
  }
}
