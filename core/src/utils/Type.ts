export type Type<C> = { [K in keyof C as C[K] extends Function ? never : K]: Type<C[K]> };
