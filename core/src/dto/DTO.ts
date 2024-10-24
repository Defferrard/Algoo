import { DeepPartial } from '../utils/DeepPartial';
import { Type } from '../utils/Type';
import { transformAndValidate } from 'class-transformer-validator';
import { validateOrReject } from 'class-validator';

export abstract class DTO {
  async validateOrReject(): Promise<void> {
    return await validateOrReject(this);
  }
  constructor() {}
}

export function buildDTO<T extends DTO>(dtoClass: new () => T, props?: DeepPartial<Type<T>>) {
  return transformAndValidate(dtoClass, props ?? {});
}
