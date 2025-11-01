import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createGif() {
	const width = 704;
	const height = 1472;

	const encoder = new GIFEncoder(width, height, 'neuquant', true); // true enables alpha transparency
	const outputPath = path.join(__dirname, '../../static/footer/footer-animation.gif');
	encoder.createReadStream().pipe(fs.createWriteStream(outputPath));
	encoder.start();
	encoder.setDelay(200); // milliseconds between frames
	encoder.setQuality(10); // lower = better quality
	encoder.setRepeat(0); // 0 = loop forever
	encoder.setTransparent(true); // Enable transparency

	const frameFiles = [
		'Generated Image October 24, 2025 - 11_29AM.png',
		'Generated Image October 24, 2025 - 11_29AM(1).png',
		'Generated Image October 24, 2025 - 11_30AM.png',
		'Generated Image October 24, 2025 - 11_30AM(1).png',
		'Generated Image October 24, 2025 - 11_30AM(2).png',
		'Generated Image October 24, 2025 - 11_30AM(3).png',
		'Generated Image October 24, 2025 - 11_30AM(4).png',
		'Generated Image October 24, 2025 - 11_30AM(5).png'
	];

	// Load and add each frame
	for (const frameFile of frameFiles) {
		const framePath = path.join(__dirname, '../../static/footer', frameFile);
		const image = await loadImage(framePath);
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, width, height);
		encoder.addFrame(ctx);
	}

	encoder.finish();
	console.log(`GIF created successfully at: ${outputPath}`);
}

createGif().catch(console.error);
