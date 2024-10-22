import { DTO } from './DTO';
import { IsDateString } from 'class-validator';

export class TimeableDTO extends DTO {
  @IsDateString()
  datetime: string = new Date().toISOString();
}
