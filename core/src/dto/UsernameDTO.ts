import { IsString, Length } from 'class-validator';

export default class UsernameDTO {
  @IsString()
  @Length(3, 20)
  name: string;
}