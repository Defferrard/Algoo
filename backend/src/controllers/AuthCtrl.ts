import { JwtDTO, UserDTO } from '@defferrard/algoo-core/src/dto';
import { UsernameDTO } from '@defferrard/algoo-core/src/dto/UsernameDTO';
import { User } from '@defferrard/algoo-core/src/socket';
import { Authorized, Body, CurrentUser, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '~/services/AuthService';
import { SerializeResponse } from '~/utils/SerializeResponse';

@Service()
@JsonController('/auth')
export class AuthCtrl {
  constructor(public service: AuthService) {}

  @Post()
  @SerializeResponse(JwtDTO)
  async login(@Body() user: UsernameDTO) {
    return { jwt: this.service.signIn(user.name) };
  }

  @Get('/current')
  @Authorized()
  @SerializeResponse(UserDTO)
  async getSession(@CurrentUser() user: User) {
    return user;
  }
}
