import { DTO } from './DTO';
import { IsUUID, Length } from 'class-validator';

export class UserDTO extends DTO {
  @IsUUID()
  uuid: string;
  @Length(3, 20)
  name: string;
}
