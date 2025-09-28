import fs from 'fs';
import http from 'http';
import { handler } from './build/handler.js';

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

const server = http.createServer(handler);

server.listen(PORT, HOST, () => {
	console.log(`HTTP DEV server running on http://${HOST}:${PORT}`);
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
