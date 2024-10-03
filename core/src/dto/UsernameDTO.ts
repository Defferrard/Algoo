import { Length } from 'class-validator';

export class UsernameDTO {
  @Length(3, 20)
  name: string;
}
