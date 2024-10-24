import { DTO } from './DTO';
import { IsUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class UuidDTO extends DTO {
  @IsUUID()
  uuid: string = uuid();
}
