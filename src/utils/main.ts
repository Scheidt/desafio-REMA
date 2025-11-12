/**
 * Safely converts a string to a number
 * @param arg - The string to convert
 * @returns The converted number or undefined if invalid
 */
export function stringToNumber(arg?: string): number | undefined {
	if (arg === undefined || arg === null || arg.trim() === "") {
		return undefined;
	}

	const n = Number(arg);
	return Number.isNaN(n) || !Number.isFinite(n) ? undefined : n;
}
