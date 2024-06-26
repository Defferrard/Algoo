/**
 * Throw an error if the object is undefined. Otherwise, return the object in a not-undefined type.
 * @param object Object to check
 * @param error Error to throw if the object is undefined
 * @returns Object in a not-undefined type
 */
export function notUndefined<T>(object: T | undefined, error?: Error): T {
  if (!object) {
    throw error || new Error(`Given object is undefined.`);
  }
  return object;
}

/**
 * Throw an error if the object is null. Otherwise, return the object in a not-null type.
 * @param object Object to check
 * @param error Error to throw if the object is null
 * @returns Object in a not-null type
 */
export function notNull<T>(object: T | null, error?: Error): T {
  if (!object) {
    throw error || new Error(`Given object is null.`);
  }
  return object;
}
