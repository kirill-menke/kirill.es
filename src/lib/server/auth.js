import { createHash, timingSafeEqual } from 'crypto';

const REALM = 'Basic realm="kirill.es", charset="UTF-8"';

/**
 * Returns true if the path requires admin authentication.
 * Covers the landscape tool (including `__data.json` requests) and all API routes.
 *
 * @param {string} pathname - URL pathname
 * @returns {boolean}
 */
export function isProtectedPath(pathname) {
	return (
		pathname === '/landscape' ||
		pathname.startsWith('/landscape/') ||
		pathname.startsWith('/api/')
	);
}

/**
 * Compares two strings in constant time. Both values are hashed first so that
 * inputs of different length can be compared without leaking the length.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function safeEqual(a, b) {
	const hashA = createHash('sha256').update(a).digest();
	const hashB = createHash('sha256').update(b).digest();
	return timingSafeEqual(hashA, hashB);
}

/**
 * Extracts the password from a Basic `Authorization` header (username is ignored).
 *
 * @param {string | null} header - Value of the Authorization header
 * @returns {string | null}
 */
function getBasicPassword(header) {
	if (!header || !header.startsWith('Basic ')) return null;

	const decoded = Buffer.from(header.slice(6).trim(), 'base64').toString('utf8');
	const separator = decoded.indexOf(':');
	return separator === -1 ? null : decoded.slice(separator + 1);
}

/**
 * Checks HTTP Basic auth against the admin password.
 * Returns an error Response if the request must be rejected, or null to let it through.
 *
 * @param {Request} request - Incoming request
 * @param {string | undefined} adminPassword - Expected password (ADMIN_PASSWORD)
 * @param {boolean} isDev - Whether running under `vite dev`
 * @returns {Response | null}
 */
export function checkBasicAuth(request, adminPassword, isDev) {
	if (!adminPassword) {
		// Allow local development without configuring a password, fail closed otherwise
		if (isDev) return null;

		console.error('ADMIN_PASSWORD not configured, refusing access to protected route');
		return new Response('Admin access is not configured', { status: 503 });
	}

	const password = getBasicPassword(request.headers.get('authorization'));
	if (password !== null && safeEqual(password, adminPassword)) {
		return null;
	}

	return new Response('Authentication required', {
		status: 401,
		headers: { 'WWW-Authenticate': REALM }
	});
}
