import { DTOFriendly, UserDTO, buildDTO } from '../dto';
import { Type } from '../utils/Type';

export default class User implements DTOFriendly<UserDTO> {
  uuid: string;
  name: string;

  constructor(dto: Type<UserDTO>) {
    this.uuid = dto.uuid;
    this.name = dto.name;
  }

  async toDTO() {
    return await buildDTO(UserDTO, {
      uuid: this.uuid,
      name: this.name,
    });
  }
}
