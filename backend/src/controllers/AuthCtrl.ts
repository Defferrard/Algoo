import { UsernameDTO } from '@defferrard/algoo-core/src/dto/UsernameDTO';
import { User } from '@defferrard/algoo-core/src/socket';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '~/services/AuthService';

@Service()
@JsonController('/auth')
export class AuthCtrl {
  constructor(
    public service: AuthService,
  ) {
  }

  @Post()
  login(@Body() user: UsernameDTO) {
    return this.service.signIn(user.name);
  }

  @Get('/current')
  @Authorized()
  getSession(@CurrentUser() user: User) {
    return user;
  }
}
