export type Type<C> = { [K in keyof C as C[K] extends (...args: unknown[]) => unknown ? never : K]: Type<C[K]> };
