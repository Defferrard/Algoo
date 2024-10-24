export type Type<C> = {
  [K in keyof C as C[K] extends (...args: unknown[]) => unknown ? never : K]: C[K] extends (infer U)[]
    ? Type<U>[]
    : Type<C[K]>;
};
