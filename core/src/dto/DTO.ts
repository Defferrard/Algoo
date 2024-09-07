import { Type } from '../utils/Type';
import { validateOrReject } from 'class-validator';

export abstract class DTO {
  async validateOrReject(): Promise<void> {
    return await validateOrReject(this);
  }
}

export function buildDTO<T extends DTO>(dtoClass: new () => T, props: Type<T>): T {
  return Object.assign(new dtoClass(), props);
}
