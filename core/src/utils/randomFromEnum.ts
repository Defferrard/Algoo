export function randomFromEnum<T extends string, V extends string>(e: { [key in T]: V }): V {
  const values: V[] = Object.values(e);
  let randomIndex: number = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}
