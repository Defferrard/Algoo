import { transformAndValidate } from 'class-transformer-validator';
import { validateOrReject } from 'class-validator';

export abstract class DTO {
  async validateOrReject(): Promise<void> {
    return await validateOrReject(this);
  }
  constructor() {}
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function buildDTO<T extends DTO>(dtoClass: new () => T, props?: DeepPartial<T>) {
  return transformAndValidate(dtoClass, props ?? {});
}
