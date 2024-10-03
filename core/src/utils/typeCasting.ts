export function objectEntries<K extends string | symbol, V>(obj: { [key in K]?: V }) {
  return Object.entries(obj).map(([key, value]) => [key, value] as [K, V]);
}
