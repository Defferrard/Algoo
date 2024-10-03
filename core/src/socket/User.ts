import { DTOFriendly, UserDTO } from '../dto';
import { Type } from '../utils/Type';

export default class User implements DTOFriendly<UserDTO> {
  uuid: string;
  name: string;

  constructor(dto: Type<UserDTO>) {
    this.uuid = dto.uuid;
    this.name = dto.name;
  }

  toDTO() {
    const dto = new UserDTO();
    dto.uuid = this.uuid;
    dto.name = this.name;
    return dto;
  }
}
