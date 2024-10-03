import { DTO } from './DTO';
import { TeamDTO } from './TeamDTO';
import { UserDTO } from './UserDTO';
import { IsBoolean, IsNotEmptyObject, ValidateNested } from 'class-validator';

export class PlayerDTO extends DTO {
  @ValidateNested()
  @IsNotEmptyObject()
  team: TeamDTO;
  @ValidateNested()
  @IsNotEmptyObject()
  user: UserDTO;

  @IsBoolean()
  isReady: boolean = false;
}
