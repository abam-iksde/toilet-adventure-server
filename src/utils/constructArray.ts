export function constructArray<T>(length: number, callback: (index: number) => T): T[] {
	return Array.from({ length }).map((_, index) => callback(index))
}
