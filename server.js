import fs from 'fs';
import https from 'https';
import { handler } from './build/handler.js';

const PORT = 443;
const HOST = '0.0.0.0';

const SSL_OPTIONS = {
	key: fs.readFileSync('./ssl/private.key'),
	cert: fs.readFileSync('./ssl/certificate.crt')
};

const server = https.createServer(SSL_OPTIONS, handler);

server.listen(PORT, HOST, () => {
	console.log(`HTTPS server running on https://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(() => {
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('SIGINT received, shutting down gracefully');
	server.close(() => {
		process.exit(0);
	});
});