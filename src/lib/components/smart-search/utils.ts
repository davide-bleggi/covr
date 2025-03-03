export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
	let timer: NodeJS.Timeout;
	return function(this: any, ...args: Parameters<T>): void {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), delay);
	};
}
