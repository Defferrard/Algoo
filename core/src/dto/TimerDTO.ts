import { TimeableDTO } from './TimeableDTO';
import { IsDateString } from 'class-validator';

export class TimerDTO extends TimeableDTO {
  @IsDateString()
  endtime: string;
}
