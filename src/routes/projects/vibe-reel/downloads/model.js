/*
 * The torrent behind "Watch while it downloads": 40 pieces, done in order up to the download
 * frontier, plus the last piece, which qBittorrent fetches first so the container index is
 * readable, and the playhead some way behind the frontier.
 *
 * The bar gets the download as { frontier, playhead, lastDone, waiting }. `frontier` counts the
 * pieces done in order, with the fraction of the one loading; `playhead` is the position read, in
 * pieces; `waiting` is set when playback has caught up with the frontier (or the last piece is not
 * in yet) and holds. The page shows `still`; `download()` runs the same picture as a loop.
 */
export const PIECES = 40;
const FRONTIER = 17;
const PLAYHEAD = 12;

/** The picture the page shows: piece 18 half loaded, piece 13 playing */
export const still = {
	frontier: FRONTIER + 0.5,
	playhead: PLAYHEAD + 0.5,
	lastDone: true,
	waiting: false
};

export const summary = `Torrent pieces: 1–${FRONTIER} done, ${FRONTIER + 1} loading, ${FRONTIER + 2}–${PIECES - 1} missing, ${PIECES} (the last) done; playing piece ${PLAYHEAD + 1}`;

export const liveSummary = `Torrent pieces downloading in a loop: piece 1 and piece ${PIECES} (the last) first, then the rest in order, stalling now and then, while playback follows the download frontier and waits whenever it catches up`;

/** Each piece's state: 'done', 'loading' or 'missing' */
export function pieceStates({ frontier, lastDone }) {
	const at = Math.floor(frontier);
	return Array.from({ length: PIECES }, (_, i) =>
		i < at || (i === PIECES - 1 && lastDone)
			? 'done'
			: i === at || i === PIECES - 1
				? 'loading'
				: 'missing'
	);
}

/** How much of the loading piece is in, 0 to 1 */
export const progress = ({ frontier }) => frontier - Math.floor(frontier);

/** The whole file is in */
export const complete = ({ frontier }) => frontier >= PIECES;

/* The download at 1× speed, as stretches of [frontier, seconds]: each takes the frontier on to
   `frontier` in `seconds`, or, ending where it starts, stalls it that long, as a torrent does
   while it waits for peers. Piece 1 and the last one come in together, then the rest in runs a
   little quicker than playback, so that the frontier draws ahead, broken by three stalls in
   which playback catches up and waits. Playback reads a piece in PLAY seconds, and the finished
   file stays up for HOLD before the loop starts over. */
const STRETCHES = [
	[1, 0.9],
	[9.4, 3.4],
	[9.4, 1.5],
	[18.6, 3.7],
	[18.6, 2.7],
	[29.3, 4.2],
	[29.3, 1.7],
	[PIECES - 1, 3.8]
];
const PLAY = 0.45;
const HOLD = 1.6;

// The frontier against time: [seconds, frontier] points joined by straight lines
const POINTS = STRETCHES.reduce(
	(points, [frontier, seconds]) => [...points, [points.at(-1)[0] + seconds, frontier]],
	[[0, 0]]
);
const [END] = POINTS.at(-1);

/** The frontier at `t` seconds into the download, and whether the last piece is in */
function frontierAt(t) {
	// Pieces 1 to 39 in order, and the last one came first: the whole file
	if (t >= END) return { frontier: PIECES, lastDone: true };
	let i = 0;
	while (POINTS[i + 1][0] <= t) i++;
	const [[t0, x0], [t1, x1]] = POINTS.slice(i, i + 2);
	const frontier = x0 + ((x1 - x0) * (t - t0)) / (t1 - t0);
	return { frontier, lastDone: frontier >= 1 };
}

/** When the frontier first gets to `frontier` */
function timeAt(frontier) {
	let i = 0;
	while (POINTS[i + 1][1] < frontier) i++;
	const [[t0, x0], [t1, x1]] = POINTS.slice(i, i + 2);
	return t0 + ((t1 - t0) * (frontier - x0)) / (x1 - x0);
}

/**
 * The download as a loop, starting from `still`: call the returned step with the seconds since
 * the last frame (already scaled by the speed) to get the download at that moment.
 */
export function download() {
	let t = timeAt(still.frontier);
	let playhead = still.playhead;
	let held = 0;

	return (dt) => {
		t += dt;
		const { frontier, lastDone } = frontierAt(t);
		// Nothing plays before the last piece is in; then never into the piece still loading
		const limit = !lastDone ? 0 : frontier >= PIECES ? PIECES : Math.floor(frontier);
		playhead = Math.min(limit, playhead + (lastDone ? dt / PLAY : 0));
		const waiting = playhead >= limit && limit < PIECES;

		if (playhead >= PIECES) {
			held += dt;
			if (held >= HOLD) {
				t = 0;
				playhead = 0;
				held = 0;
				return { ...frontierAt(0), playhead, waiting: true };
			}
		}
		return { frontier, playhead, lastDone, waiting };
	};
}
