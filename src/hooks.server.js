import { writeFileSync } from 'fs';
import { join } from 'path';
import { building, dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { checkBasicAuth, isProtectedPath } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	// Skip auth and logging during prerendering (only public pages are prerendered,
	// and neither the client address nor dynamic env are available at build time)
	if (building) {
		return await resolve(event);
	}

	const clientIP = event.getClientAddress();
	const method = event.request.method;
	const path = event.url.pathname + event.url.search;
	const userAgent = event.request.headers.get('user-agent') || '';

	// Guard the landscape tool and the API with HTTP Basic auth
	const authFailure = isProtectedPath(event.url.pathname)
		? checkBasicAuth(event.request, env.ADMIN_PASSWORD, dev)
		: null;

	const response = authFailure ?? (await resolve(event));
	const status = response.status;

	const logMessage = `[${new Date().toISOString()}] ${method} ${path} ${status} - ${clientIP} "${userAgent}"`;

	console.log(logMessage);

	const logFile = join(process.cwd(), 'logs', 'access.log');
	try {
		writeFileSync(logFile, logMessage + '\n', { flag: 'a' });
	} catch (error) {
		console.error('Failed to write to log file:', error);
	}

	return response;
}
