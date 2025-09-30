import { json } from '@sveltejs/kit';
import { getTiles, upsertTile, deleteTile } from '$lib/db.js';

export async function GET() {
	try {
		const tiles = getTiles();
		return json(tiles);
	} catch (error) {
		console.error('Error fetching tiles:', error);
		return json({ error: 'Failed to fetch tiles' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { position, image_url, prompt } = await request.json();

		// Validate input
		if (position === undefined || position === null) {
			return json({ error: 'Position is required' }, { status: 400 });
		}

		if (position < 0 || position > 79) {
			return json({ error: 'Position must be between 0 and 79' }, { status: 400 });
		}

		if (!image_url || !prompt) {
			return json({ error: 'Image URL and prompt are required' }, { status: 400 });
		}

		// Upsert the tile
		const result = upsertTile(position, image_url, prompt);

		return json({
			success: true,
			changes: result.changes
		});
	} catch (error) {
		console.error('Error saving tile:', error);
		return json({ error: 'Failed to save tile' }, { status: 500 });
	}
}

export async function DELETE({ url }) {
	try {
		const position = url.searchParams.get('position');

		if (position === null) {
			return json({ error: 'Position is required' }, { status: 400 });
		}

		const positionNum = parseInt(position);

		if (isNaN(positionNum) || positionNum < 0 || positionNum > 79) {
			return json({ error: 'Invalid position' }, { status: 400 });
		}

		const result = deleteTile(positionNum);

		return json({
			success: true,
			changes: result.changes
		});
	} catch (error) {
		console.error('Error deleting tile:', error);
		return json({ error: 'Failed to delete tile' }, { status: 500 });
	}
}
