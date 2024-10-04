import { DTO } from './DTO';
import { IsJWT } from 'class-validator';

export class JwtDTO extends DTO {
  @IsJWT()
  jwt: string;
}
