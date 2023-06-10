/**
 * useStorage
 * @param key
 * @returns
 */
export function useStorage<T = unknown>(key: string) {
	return {
		get: () => {
			const data = localStorage.getItem(`${window.location.host}/${key}`);
			return data ? (JSON.parse(data) as T) : null;
		},
		set: (data: T) =>
			localStorage.setItem(
				`${window.location.host}/${key}`,
				JSON.stringify(data)
			),
		remove: () => localStorage.removeItem(`${window.location.host}/${key}`),
	};
}

/**
 * toCurrency
 * @param val
 * @returns
 */
export function toCurrency(val: number) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	return formatter.format(val);
}
