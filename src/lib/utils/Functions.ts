export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function inRange(number: number, minimal: number, maximal: number): boolean {
    return ((number - minimal) * (number - maximal) <= 0);
}