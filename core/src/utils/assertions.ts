/**
 * Throw an error if the object is undefined. Otherwise, return the object in a not-undefined type.
 * @param object Object to check
 * @param error Error to throw if the object is undefined
 * @returns Object in a not-undefined type
 */
export function notUndefined<T>(object: T | undefined, error?: Error): T {
  if (object === undefined) {
    throw error || new Error('Given object is undefined.');
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
  if (object === undefined || object === null) {
    throw error || new Error('Given object is null or undefined.');
  }
  return object;
}

/**
 * Throw an error if the object is either undefined or null.
 * @param object Object to check
 * @param error Error class to throw if the object is undefined or null
 * @param args Arguments to pass to the error class constructor
 */
export function assertNonNull<T, Err extends Error, Args extends unknown[]>(
  object: T | null,
  error?: new (...args: Args) => Err,
  ...args: Args
): asserts object is NonNullable<T> {
  if (object === undefined || object === null) {
    throw error ? new error(...args) : new Error('Given object is null or undefined.');
  }
}
