import { json } from '@sveltejs/kit';
import { GoogleGenAI, Modality } from '@google/genai';
import sharp from 'sharp';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import yaml from 'js-yaml';
import pkg from 'stability-ai';
const StabilityAI = pkg.default || pkg;

const GEMINI_API_KEY = 'AIzaSyBsNaydZySQ8kU0ZS5mnRerOKpsGsSJTZ0';
const STABILITY_API_KEY = 'sk-IiJJvgSTHWqfR016iwm0q1bbx6fJrmsrPA80gCcRWTBZqD8I';
const TILE_SIZE = 256;
const INPAINT_BORDER = 40; // Width of the inpainting border in pixels
const DEBUG_PIPELINE = true; // Set to true to save debug images

// Load prompts from YAML file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug directory path (from src/routes/api/generate-image up to project root)
const debugPath = join(__dirname, '../../../../debug');

/**
 * Converts image data to a buffer.
 * @param {Buffer|string} imageData - Image buffer or base64 data URL
 * @returns {Buffer} - Image buffer
 */
function toBuffer(imageData) {
	if (typeof imageData === 'string') {
		const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');
		return Buffer.from(base64Data, 'base64');
	}
	return imageData;
}

/**
 * Creates a combined debug image showing all pipeline steps in a single row.
 * Layout: [GenAI Input] [GenAI Output] [Downsampled + Mask Overlay] [Final Tile]
 *
 * @param {Object} debugData - Object containing all debug images
 * @param {Buffer|string} debugData.genaiInput - Input image sent to GenAI
 * @param {Buffer|string} debugData.genaiOutput - Raw output from GenAI
 * @param {Buffer} debugData.downsampledGrid - Downsampled grid before inpainting
 * @param {Buffer} debugData.mask - The inpainting mask
 * @param {Buffer} debugData.inpaintedGrid - Grid after inpainting
 * @param {Buffer} debugData.finalResult - Final extracted tile
 * @param {number} debugData.centerOffsetX - X offset of center tile
 * @param {number} debugData.centerOffsetY - Y offset of center tile
 * @param {string} debugId - Unique ID for this generation run
 */
async function saveCombinedDebugImage(debugData, debugId) {
	if (!DEBUG_PIPELINE) return;

	try {
		const { genaiInput, genaiOutput, downsampledGrid, mask, finalResult } = debugData;

		const padding = 10; // Padding between images

		// Process images to have consistent height for display
		const targetHeight = TILE_SIZE * 1.5; // Slightly larger to show grid detail

		const processImage = async (imageData, maxWidth = TILE_SIZE * 3) => {
			const buffer = toBuffer(imageData);
			const metadata = await sharp(buffer).metadata();
			const aspectRatio = metadata.width / metadata.height;
			let newWidth = Math.round(targetHeight * aspectRatio);
			let newHeight = targetHeight;

			// Cap width to maxWidth
			if (newWidth > maxWidth) {
				newWidth = maxWidth;
				newHeight = Math.round(maxWidth / aspectRatio);
			}

			return {
				buffer: await sharp(buffer)
					.resize(Math.round(newWidth), Math.round(newHeight), { fit: 'inside' })
					.png()
					.toBuffer(),
				width: Math.round(newWidth),
				height: Math.round(newHeight),
				originalWidth: metadata.width,
				originalHeight: metadata.height
			};
		};

		// Process the main images
		const genaiInputProcessed = await processImage(genaiInput);
		const genaiOutputProcessed = await processImage(genaiOutput);
		const finalTileProcessed = await processImage(finalResult, TILE_SIZE);

		// Create mask overlay on the downsampled grid
		// The mask shows where inpainting will happen (white areas in mask = red overlay)
		const gridBuffer = toBuffer(downsampledGrid);

		// Create red semi-transparent overlay from the mask
		// Convert mask (white = inpaint) to red transparent overlay
		const maskBuffer = toBuffer(mask);
		const redMask = await sharp(maskBuffer)
			.ensureAlpha()
			.modulate({ brightness: 1 })
			.tint({ r: 255, g: 0, b: 0 })
			.composite([
				{
					input: Buffer.from([255, 0, 0, 100]), // Semi-transparent red
					raw: { width: 1, height: 1, channels: 4 },
					tile: true,
					blend: 'dest-in'
				}
			])
			.png()
			.toBuffer();

		// Composite mask overlay onto the downsampled grid
		const gridWithMask = await sharp(gridBuffer)
			.composite([{ input: redMask, blend: 'over' }])
			.png()
			.toBuffer();

		// Resize for display
		const gridProcessed = await processImage(gridWithMask);

		// Calculate total dimensions
		const totalWidth =
			genaiInputProcessed.width +
			padding +
			genaiOutputProcessed.width +
			padding +
			gridProcessed.width +
			padding +
			finalTileProcessed.width;
		const totalHeight = Math.round(targetHeight);

		// Create the combined image
		const compositeOps = [];
		let xOffset = 0;

		// Add each image centered vertically
		const addImage = (processed) => {
			const yOffset = Math.floor((totalHeight - processed.height) / 2);
			compositeOps.push({
				input: processed.buffer,
				left: xOffset,
				top: yOffset
			});
			xOffset += processed.width + padding;
		};

		addImage(genaiInputProcessed);
		addImage(genaiOutputProcessed);
		addImage(gridProcessed);
		addImage(finalTileProcessed);

		// Create the final combined image
		const combinedBuffer = await sharp({
			create: {
				width: totalWidth,
				height: totalHeight,
				channels: 4,
				background: { r: 40, g: 40, b: 40, alpha: 255 } // Dark gray background
			}
		})
			.composite(compositeOps)
			.png()
			.toBuffer();

		// Save the combined image
		const filename = `${debugId}_pipeline.png`;
		const filepath = join(debugPath, filename);
		writeFileSync(filepath, combinedBuffer);
		console.log(`Debug: saved combined pipeline image ${filename}`);
	} catch (error) {
		console.error('Failed to save combined debug image:', error);
	}
}

// Navigate from src/routes/api/generate-image up to src/lib
const promptsPath = join(__dirname, '../../../lib/prompts.yaml');
const prompts = yaml.load(readFileSync(promptsPath, 'utf8'));

// Path to landscape reference images (from src/routes/api/generate-image up to static)
const referencesPath = join(__dirname, '../../../../static/landscape-references');

/**
 * Selects a random reference image from the landscape-references directory.
 * Returns the image as a base64 data URL.
 *
 * @returns {{ dataUrl: string, filename: string }} - The reference image data URL and filename
 */
function getRandomReferenceImage() {
	const files = readdirSync(referencesPath).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));

	if (files.length === 0) {
		throw new Error('No reference images found in static/landscape-references');
	}

	const randomFile = files[Math.floor(Math.random() * files.length)];
	const filePath = join(referencesPath, randomFile);
	const imageBuffer = readFileSync(filePath);

	// Determine MIME type from extension
	const ext = randomFile.split('.').pop().toLowerCase();
	const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;

	const dataUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

	return { dataUrl, filename: randomFile };
}

/**
 * Maps neighbor positions to their grid coordinates in a 3x3 grid.
 * The center (1,1) is where the new tile will be generated.
 */
const POSITION_TO_GRID = {
	top: { x: 1, y: 0 },
	bottom: { x: 1, y: 2 },
	left: { x: 0, y: 1 },
	right: { x: 2, y: 1 }
};

/**
 * Calculates the minimal bounding box that contains the center tile and all neighbors.
 * Returns the grid dimensions and offsets needed for optimal canvas size.
 *
 * @param {Object} neighbors - Object with keys: top, bottom, left, right and data URL values
 * @returns {Object} - { minX, maxX, minY, maxY, width, height, centerOffsetX, centerOffsetY }
 */
function calculateBoundingBox(neighbors) {
	// Center tile is always at (1, 1) in the 3x3 grid
	const centerX = 1;
	const centerY = 1;

	let minX = centerX;
	let maxX = centerX;
	let minY = centerY;
	let maxY = centerY;

	// Expand bounding box to include each neighbor
	for (const [position, imageUrl] of Object.entries(neighbors)) {
		if (!imageUrl || !imageUrl.startsWith('data:') || !POSITION_TO_GRID[position]) {
			continue;
		}

		const gridPos = POSITION_TO_GRID[position];
		minX = Math.min(minX, gridPos.x);
		maxX = Math.max(maxX, gridPos.x);
		minY = Math.min(minY, gridPos.y);
		maxY = Math.max(maxY, gridPos.y);
	}

	const width = (maxX - minX + 1) * TILE_SIZE;
	const height = (maxY - minY + 1) * TILE_SIZE;
	const centerOffsetX = (centerX - minX) * TILE_SIZE;
	const centerOffsetY = (centerY - minY) * TILE_SIZE;

	return { minX, maxX, minY, maxY, width, height, centerOffsetX, centerOffsetY };
}

const BORDER_WIDTH = 4; // Width of the green border around the center area

/**
 * Stitches neighbor tiles into a minimal-sized grid image.
 * - Creates a canvas that only includes existing neighbors and the center tile
 * - The center is filled with white with a green border to mark the generation area
 * - No extra blank space
 *
 * @param {Object} neighbors - Object with keys: top, bottom, left, right and data URL values
 * @returns {Promise<Object>} - { imageDataUrl: string, centerOffsetX: number, centerOffsetY: number }
 */
async function stitchNeighborTiles(neighbors) {
	const bbox = calculateBoundingBox(neighbors);

	// Build composite operations for each neighbor tile
	const compositeOps = [];

	// Create white center tile with green border to mark the generation area
	const greenTile = await sharp({
		create: {
			width: TILE_SIZE,
			height: TILE_SIZE,
			channels: 3,
			background: { r: 0, g: 255, b: 0 } // Green border
		}
	})
		.png()
		.toBuffer();

	const innerWhiteTile = await sharp({
		create: {
			width: TILE_SIZE - BORDER_WIDTH * 2,
			height: TILE_SIZE - BORDER_WIDTH * 2,
			channels: 3,
			background: { r: 255, g: 255, b: 255 } // White center
		}
	})
		.png()
		.toBuffer();

	// Composite white onto green to create bordered tile
	const borderedTile = await sharp(greenTile)
		.composite([
			{
				input: innerWhiteTile,
				left: BORDER_WIDTH,
				top: BORDER_WIDTH
			}
		])
		.png()
		.toBuffer();

	compositeOps.push({
		input: borderedTile,
		left: bbox.centerOffsetX,
		top: bbox.centerOffsetY
	});

	// Add each neighbor tile
	for (const [position, imageUrl] of Object.entries(neighbors)) {
		if (!imageUrl || !imageUrl.startsWith('data:') || !POSITION_TO_GRID[position]) {
			continue;
		}

		try {
			// Extract base64 data and convert to buffer
			const base64Data = imageUrl.replace(/^data:[^;]+;base64,/, '');
			const imageBuffer = Buffer.from(base64Data, 'base64');

			// Resize to ensure consistent tile size
			const resizedBuffer = await sharp(imageBuffer)
				.resize(TILE_SIZE, TILE_SIZE)
				.png()
				.toBuffer();

			const gridPos = POSITION_TO_GRID[position];
			// Calculate position relative to the minimal bounding box
			const relativeX = (gridPos.x - bbox.minX) * TILE_SIZE;
			const relativeY = (gridPos.y - bbox.minY) * TILE_SIZE;

			compositeOps.push({
				input: resizedBuffer,
				left: relativeX,
				top: relativeY
			});
		} catch (err) {
			console.error(`Failed to load neighbor image at ${position}:`, err);
		}
	}

	// Create transparent base canvas with minimal size and composite all tiles
	const resultBuffer = await sharp({
		create: {
			width: bbox.width,
			height: bbox.height,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite(compositeOps)
		.png()
		.toBuffer();

	const imageDataUrl = `data:image/png;base64,${resultBuffer.toString('base64')}`;
	return {
		imageDataUrl,
		centerOffsetX: bbox.centerOffsetX,
		centerOffsetY: bbox.centerOffsetY,
		width: bbox.width,
		height: bbox.height
	};
}

/**
 * Creates a mask for inpainting seams on the full grid image.
 * The mask covers 40px on each side of every seam between the center tile and its neighbors.
 *
 * @param {number} gridWidth - Width of the full grid image
 * @param {number} gridHeight - Height of the full grid image
 * @param {number} centerOffsetX - X offset of center tile in the grid
 * @param {number} centerOffsetY - Y offset of center tile in the grid
 * @param {Object} neighbors - Object with neighbor positions and data URLs
 * @returns {Promise<Buffer>} - The mask buffer (white = inpaint, black = preserve)
 */
async function createGridMask(gridWidth, gridHeight, centerOffsetX, centerOffsetY, neighbors) {
	// Start with black (preserve everything)
	const maskOps = [];

	// For each neighbor, create a white rectangle covering the seam area
	// The seam area is 40px into the center tile + 40px into the neighbor
	for (const [position, imageUrl] of Object.entries(neighbors)) {
		if (!imageUrl || !imageUrl.startsWith('data:') || !POSITION_TO_GRID[position]) {
			continue;
		}

		let seamRegion;
		if (position === 'top') {
			// Seam is at the top edge of center tile
			// Covers: 40px above center tile (in neighbor) + 40px into center tile
			seamRegion = {
				left: centerOffsetX,
				top: centerOffsetY - INPAINT_BORDER,
				width: TILE_SIZE,
				height: INPAINT_BORDER * 2
			};
		} else if (position === 'bottom') {
			// Seam is at the bottom edge of center tile
			seamRegion = {
				left: centerOffsetX,
				top: centerOffsetY + TILE_SIZE - INPAINT_BORDER,
				width: TILE_SIZE,
				height: INPAINT_BORDER * 2
			};
		} else if (position === 'left') {
			// Seam is at the left edge of center tile
			seamRegion = {
				left: centerOffsetX - INPAINT_BORDER,
				top: centerOffsetY,
				width: INPAINT_BORDER * 2,
				height: TILE_SIZE
			};
		} else if (position === 'right') {
			// Seam is at the right edge of center tile
			seamRegion = {
				left: centerOffsetX + TILE_SIZE - INPAINT_BORDER,
				top: centerOffsetY,
				width: INPAINT_BORDER * 2,
				height: TILE_SIZE
			};
		}

		if (seamRegion) {
			// Clamp to grid bounds
			const clampedLeft = Math.max(0, seamRegion.left);
			const clampedTop = Math.max(0, seamRegion.top);
			const clampedRight = Math.min(gridWidth, seamRegion.left + seamRegion.width);
			const clampedBottom = Math.min(gridHeight, seamRegion.top + seamRegion.height);
			const clampedWidth = clampedRight - clampedLeft;
			const clampedHeight = clampedBottom - clampedTop;

			if (clampedWidth > 0 && clampedHeight > 0) {
				const whiteRect = await sharp({
					create: {
						width: clampedWidth,
						height: clampedHeight,
						channels: 3,
						background: { r: 196, g: 196, b: 196 } // Gray/white = inpaint
					}
				})
					.png()
					.toBuffer();

				maskOps.push({
					input: whiteRect,
					left: clampedLeft,
					top: clampedTop
				});
			}
		}
	}

	// Create black base and composite white rectangles
	const blackBase = await sharp({
		create: {
			width: gridWidth,
			height: gridHeight,
			channels: 3,
			background: { r: 0, g: 0, b: 0 } // Black = preserve
		}
	})
		.png()
		.toBuffer();

	if (maskOps.length === 0) {
		return blackBase;
	}

	const mask = await sharp(blackBase).composite(maskOps).png().toBuffer();

	return mask;
}

/**
 * Inpaints the seam areas on the full grid image before extracting the center tile.
 *
 * @param {Buffer} gridBuffer - The full grid image buffer (downsampled GenAI output)
 * @param {number} gridWidth - Width of the grid
 * @param {number} gridHeight - Height of the grid
 * @param {number} centerOffsetX - X offset of center tile
 * @param {number} centerOffsetY - Y offset of center tile
 * @param {Object} neighbors - Object with neighbor positions and data URLs
 * @param {string} prompt - The original prompt for context
 * @returns {Promise<{ inpaintedGrid: Buffer, mask: Buffer }>} - The inpainted grid and mask used
 */
async function inpaintGridSeams(
	gridBuffer,
	gridWidth,
	gridHeight,
	centerOffsetX,
	centerOffsetY,
	neighbors,
	prompt
) {
	// Create mask for all seams
	const mask = await createGridMask(gridWidth, gridHeight, centerOffsetX, centerOffsetY, neighbors);

	if (!STABILITY_API_KEY) {
		console.warn('STABILITY_API_KEY not set, skipping inpainting');
		return { inpaintedGrid: gridBuffer, mask };
	}

	const stability = new StabilityAI(STABILITY_API_KEY);

	try {
		// Write grid image and mask to temp files (stability-ai SDK requires file paths)
		const gridPath = join(tmpdir(), `grid_${Date.now()}.png`);
		const maskPath = join(tmpdir(), `mask_${Date.now()}.png`);
		writeFileSync(gridPath, gridBuffer);
		writeFileSync(maskPath, mask);

		console.log('Debug: calling Stability AI inpaint on full grid');
		const result = await stability.v2beta.stableImage.edit.inpaint(
			gridPath,
			prompt,
			{
				mask: maskPath,
				output_format: 'png'
			}
		);

		// Read the result file
		const inpaintedBuffer = readFileSync(result.filepath);

		// Clean up temp files
		try {
			const { unlinkSync } = await import('fs');
			unlinkSync(gridPath);
			unlinkSync(maskPath);
			unlinkSync(result.filepath);
		} catch {
			// Ignore cleanup errors
		}

		return { inpaintedGrid: inpaintedBuffer, mask };
	} catch (error) {
		console.error('Stability AI inpaint failed:', error);
		return { inpaintedGrid: gridBuffer, mask };
	}
}

/**
 * Selects the appropriate prompt template based on neighbor count and fills in variables.
 *
 * @param {string} userPrompt - The user's content description
 * @param {Object} neighbors - Object with neighbor positions
 * @returns {string} - The filled prompt template
 */
function selectAndFillPrompt(userPrompt, neighbors) {
	const validNeighbors = Object.entries(neighbors).filter(
		([pos, url]) => url && url.startsWith('data:') && POSITION_TO_GRID[pos]
	);
	const neighborCount = validNeighbors.length;
	const directions = validNeighbors.map(([pos]) => pos);

	let template;
	let filledPrompt;

	switch (neighborCount) {
		case 0:
			template = prompts['no-neighbors'];
			filledPrompt = template.replace('${prompt}', userPrompt);
			break;
		case 1:
			template = prompts['one-neighbor'];
			filledPrompt = template
				.replace('${prompt}', userPrompt)
				.replace(/\${direction}/g, directions[0]);
			break;
		case 2:
			template = prompts['two-neighbors'];
			filledPrompt = template
				.replace('${prompt}', userPrompt)
				.replace(/\${direction1}/g, directions[0])
				.replace(/\${direction2}/g, directions[1]);
			break;
		case 3:
			template = prompts['three-neighbors'];
			filledPrompt = template
				.replace('${prompt}', userPrompt)
				.replace(/\${direction1}/g, directions[0])
				.replace(/\${direction2}/g, directions[1])
				.replace(/\${direction3}/g, directions[2]);
			break;
		case 4:
			template = prompts['four-neighbors'];
			filledPrompt = template.replace('${prompt}', userPrompt);
			break;
		default:
			template = prompts['no-neighbors'];
			filledPrompt = template.replace('${prompt}', userPrompt);
	}

	return filledPrompt;
}

export async function POST({ request }) {
	try {
		const { prompt, neighbors } = await request.json();

		if (!prompt) {
			return json({ error: 'Prompt is required' }, { status: 400 });
		}

		// Generate a unique debug ID for this generation run
		const debugId = `gen_${Date.now()}`;
		console.log(`Debug: starting generation with ID ${debugId}`);

		// Initialize Gemini AI
		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

		// Build the contents array for multi-modal generation
		const contents = [];

		// Check if we have valid neighbors
		const hasNeighbors =
			neighbors &&
			Object.entries(neighbors).some(
				([pos, url]) => url && url.startsWith('data:') && POSITION_TO_GRID[pos]
			);

		// Store center offset coordinates and expected dimensions for extraction later
		let centerOffsetX = 0;
		let centerOffsetY = 0;
		let expectedWidth = TILE_SIZE;
		let expectedHeight = TILE_SIZE;

		if (hasNeighbors) {
			// Stitch neighbors into a minimal-sized image with white center for generation
			const stitchedResult = await stitchNeighborTiles(neighbors);
			centerOffsetX = stitchedResult.centerOffsetX;
			centerOffsetY = stitchedResult.centerOffsetY;
			expectedWidth = stitchedResult.width;
			expectedHeight = stitchedResult.height;

			console.log(
				`Debug: input dimensions: ${expectedWidth}x${expectedHeight}, center offsets: (${centerOffsetX}, ${centerOffsetY})`
			);

			// Select the appropriate prompt based on neighbor count
			const instructionPrompt = selectAndFillPrompt(prompt, neighbors);

			contents.push({
				text: instructionPrompt
			});

			// Add the stitched image
			const base64Match = stitchedResult.imageDataUrl.match(/^data:([^;]+);base64,(.*)$/);
			if (base64Match) {
				contents.push({
					inlineData: {
						mimeType: base64Match[1],
						data: base64Match[2]
					}
				});
			}
		} else {
			// No neighbors - use a random reference image for style guidance
			const referenceImage = getRandomReferenceImage();
			console.log(`Debug: using reference image: ${referenceImage.filename}`);

			const instructionPrompt = selectAndFillPrompt(prompt, {});
			contents.push({
				text: instructionPrompt
			});

			// Add the reference image
			const base64Match = referenceImage.dataUrl.match(/^data:([^;]+);base64,(.*)$/);
			if (base64Match) {
				contents.push({
					inlineData: {
						mimeType: base64Match[1],
						data: base64Match[2]
					}
				});
			}
		}

		console.log('Prompt:', contents[0]?.text?.substring(0, 200) + '...');

		// Store GenAI input for debug
		const genaiInputData = contents[1]?.inlineData
			? `data:${contents[1].inlineData.mimeType};base64,${contents[1].inlineData.data}`
			: null;

		// Generate image with Gemini
		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: contents,
			config: {
				responseModalities: [Modality.TEXT, Modality.IMAGE]
			}
		});

		// Extract the generated image
		if (response.candidates && response.candidates[0] && response.candidates[0].content) {
			for (const part of response.candidates[0].content.parts) {
				if (part.inlineData) {
					const imageData = part.inlineData.data;
					const genaiOutputData = `data:${part.inlineData.mimeType};base64,${imageData}`;

					let imageUrl;
					if (hasNeighbors) {
						// Step 1: Downsample GenAI output to match expected input dimensions
						const outputBuffer = Buffer.from(imageData, 'base64');
						const metadata = await sharp(outputBuffer).metadata();
						console.log(
							`Debug: resizing GenAI output from ${metadata.width}x${metadata.height} to ${expectedWidth}x${expectedHeight}`
						);

						const downsampledGrid = await sharp(outputBuffer)
							.resize(expectedWidth, expectedHeight, { fit: 'fill' })
							.png()
							.toBuffer();

						// Step 2: Inpaint seams on the full grid BEFORE extracting center tile
						console.log('Debug: inpainting seams on full grid');
						const { inpaintedGrid, mask } = await inpaintGridSeams(
							downsampledGrid,
							expectedWidth,
							expectedHeight,
							centerOffsetX,
							centerOffsetY,
							neighbors,
							prompt
						);

						// Step 3: Extract center tile from the inpainted grid
						console.log(
							`Debug: extracting center tile at offset (${centerOffsetX}, ${centerOffsetY})`
						);
						const finalTileBuffer = await sharp(inpaintedGrid)
							.extract({
								left: centerOffsetX,
								top: centerOffsetY,
								width: TILE_SIZE,
								height: TILE_SIZE
							})
							.png()
							.toBuffer();

						// Save combined debug image
						await saveCombinedDebugImage(
							{
								genaiInput: genaiInputData,
								genaiOutput: genaiOutputData,
								downsampledGrid: downsampledGrid,
								mask: mask,
								inpaintedGrid: inpaintedGrid,
								finalResult: finalTileBuffer,
								neighbors,
								centerOffsetX,
								centerOffsetY
							},
							debugId
						);

						imageUrl = `data:image/png;base64,${finalTileBuffer.toString('base64')}`;
					} else {
						// No neighbors - resize to standard tile size
						const outputBuffer = Buffer.from(imageData, 'base64');
						const resizedBuffer = await sharp(outputBuffer)
							.resize(TILE_SIZE, TILE_SIZE, { fit: 'fill' })
							.png()
							.toBuffer();
						imageUrl = `data:image/png;base64,${resizedBuffer.toString('base64')}`;
					}

					return json({
						imageUrl,
						message: 'Image generated successfully'
					});
				}
			}
		}

		// If no image was generated, return error
		return json(
			{
				error: 'No image was generated. Try a different prompt.'
			},
			{ status: 500 }
		);
	} catch (error) {
		console.error('Error generating image:', error);

		// Check if it's an API key issue
		if (error.message && error.message.includes('API key')) {
			return json(
				{
					error: 'API key issue. Please check the Gemini API key configuration.'
				},
				{ status: 500 }
			);
		}

		return json(
			{
				error: 'Failed to generate image. Please try again.'
			},
			{ status: 500 }
		);
	}
}
