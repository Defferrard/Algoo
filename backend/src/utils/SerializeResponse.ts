import { DTO } from '@defferrard/algoo-core/src/dto';
import { Type } from '@defferrard/algoo-core/src/utils/Type';
import { assertNonNull } from '@defferrard/algoo-core/src/utils/assertions';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ResponseSchema } from 'routing-controllers-openapi';

export function SerializeResponse<D extends DTO>(ResPayloadDto: ClassType<D>) {
  return function <ARGS extends unknown[], RETURN extends Type<D> | Type<D>[]>(
    target: any,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(...args: ARGS) => Promise<RETURN>>,
  ): void {
    const originalMethod = descriptor.value;
    assertNonNull(originalMethod);

    // Apply the ResponseSchema decorator
    ResponseSchema(ResPayloadDto)(target, methodName, descriptor);

    descriptor.value = async function (...args: ARGS) {
      const resPayload = await originalMethod.apply(this, args);
      try {
        let result: RETURN;
        if (Array.isArray(resPayload)) {
          result = (await Promise.all(
            resPayload.map((payload) => transformAndValidate(ResPayloadDto, payload)),
          )) as unknown as RETURN;
        } else {
          result = (await transformAndValidate(ResPayloadDto, resPayload)) as unknown as RETURN;
        }
        return result;
      } catch (e) {
        console.error(`Failed to serialize the response from ${target.constructor.name}#${methodName}`);
        throw e;
      }
    };

    Object.defineProperty(descriptor.value, 'name', { value: methodName });
  };
}
