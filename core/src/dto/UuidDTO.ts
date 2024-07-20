import { DTO } from './DTO';
import { IsUUID } from 'class-validator';

export class UuidDTO extends DTO {
  @IsUUID()
  uuid: string;
}
