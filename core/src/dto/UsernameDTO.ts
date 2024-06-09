import { IsString, Length } from 'class-validator';

export class UsernameDTO {
  @IsString()
  @Length(3, 20)
  name: string;
}
