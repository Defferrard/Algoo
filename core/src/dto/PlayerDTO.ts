import { DTO } from './DTO';
import { TeamDTO } from './TeamDTO';
import { UserDTO } from './UserDTO';
import { IsBoolean, ValidateNested } from 'class-validator';

export class PlayerDTO extends DTO {
  @ValidateNested()
  team: TeamDTO;
  @ValidateNested()
  user: UserDTO;

  @IsBoolean()
  isReady: boolean = false;
}
