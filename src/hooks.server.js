import { writeFileSync } from 'fs';
import { join } from 'path';

export async function handle({ event, resolve }) {
	// Skip logging during prerendering
	const isPrerendering = !event.platform;
	if (isPrerendering) {
		return await resolve(event);
	}

	const clientIP = event.getClientAddress();
	const method = event.request.method;
	const path = event.url.pathname + event.url.search;
	const userAgent = event.request.headers.get('user-agent') || '';

	const response = await resolve(event);
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
