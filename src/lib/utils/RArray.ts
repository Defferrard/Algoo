
export type RArray<T> = Array<T | RArray<T>>; // Recursive array

export function mapRArray<T, C>(array: RArray<T>, callback: (value: T, index: number[]) => C, currentIndex: number[] = []): RArray<C> {
    let result: RArray<C> = [];
    array.forEach((value: T | RArray<T>, i: number) => {
        if (Array.isArray(value)) {
            result.push(mapRArray(value, callback, [...currentIndex, i]));
        } else {
            result.push(callback(value, [...currentIndex, i]));
        }
    });
    return result;
}

export function setValueRArray<T>(array: RArray<T>, value: T, index: number[]): void {
    if (Array.isArray(array[index[0]])) {
        setValueRArray(array[index[0]] as RArray<T>, value, index.slice(1));
    } else {
        array[index[0]] = value;
    }
}

export function getValueRArray<T>(array: RArray<T>, index: number[]): T {
    if (Array.isArray(array[index[0]])) {
        return getValueRArray(array[index[0]] as RArray<T>, index.slice(1));
    } else {
        return array[index[0]] as T;
    }
}