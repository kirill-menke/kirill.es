const PRUNE_INTERVAL_MS = 60 * 1000;

/**
 * Creates a simple in-memory rolling-window rate limiter (per process).
 *
 * @param {Object} options
 * @param {number} options.limit - Maximum number of hits allowed per window
 * @param {number} options.windowMs - Length of the rolling window in milliseconds
 * @returns {(key: string) => { allowed: boolean, retryAfter: number }} - Records a hit for
 *   the key and reports whether it is allowed; retryAfter is in seconds
 */
export function createRateLimiter({ limit, windowMs }) {
	/** @type {Map<string, number[]>} */
	const hits = new Map();
	let lastPrune = Date.now();

	// Drop expired timestamps and empty keys so the map doesn't grow unbounded
	function prune(now) {
		for (const [key, timestamps] of hits) {
			const fresh = timestamps.filter((t) => now - t < windowMs);
			if (fresh.length === 0) {
				hits.delete(key);
			} else {
				hits.set(key, fresh);
			}
		}
		lastPrune = now;
	}

	return function check(key) {
		const now = Date.now();
		if (now - lastPrune > PRUNE_INTERVAL_MS) {
			prune(now);
		}

		const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);

		if (timestamps.length >= limit) {
			hits.set(key, timestamps);
			const retryAfter = Math.max(1, Math.ceil((timestamps[0] + windowMs - now) / 1000));
			return { allowed: false, retryAfter };
		}

		timestamps.push(now);
		hits.set(key, timestamps);
		return { allowed: true, retryAfter: 0 };
	};
}
