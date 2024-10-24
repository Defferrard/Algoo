import { DTOFriendly, PlayerDTO, buildDTO } from '../dto';
import { User } from '../socket';
import { Type } from '../utils/Type';
import { Team } from './index';

export default class Player implements DTOFriendly<PlayerDTO> {
  team: Team;
  readonly user: User;

  isReady: boolean = false;

  constructor({ user, team, isReady }: Type<PlayerDTO>) {
    this.user = new User(user);
    this.team = new Team(team);
    this.isReady = isReady;
  }
  async toDTO() {
    return await buildDTO(PlayerDTO, {
      user: await this.user.toDTO(),
      team: await this.team.toDTO(),
      isReady: this.isReady,
    });
  }
}
