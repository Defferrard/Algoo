import { DTOFriendly, UserDTO } from '../dto';
import { Type } from '../utils/Type';

export default class User implements DTOFriendly {
  uuid: string;
  name: string;

  constructor(dto: Type<UserDTO>) {
    this.uuid = dto.uuid;
    this.name = dto.name;
  }

  toDTO(): UserDTO {
    const dto = new UserDTO();
    dto.uuid = this.uuid;
    dto.name = this.name;
    return dto;
  }
}
