import { DTO, DTOFriendly, PlayerDTO } from '../dto';
import { User } from '../socket';
import { Type } from '../utils/Type';
import { Color, Team } from './index';

export default class Player implements DTOFriendly<PlayerDTO> {
  readonly team: Team;
  readonly user: User;

  isReady: boolean = false;

  constructor({ user, team, isReady }: Type<PlayerDTO>) {
    this.user = new User(user);
    this.team = new Team(team);
    this.isReady = isReady;
  }
  toDTO() {
    const dto = new PlayerDTO();
    dto.user = this.user.toDTO();
    dto.team = this.team.toDTO();
    return dto;
  }
}
