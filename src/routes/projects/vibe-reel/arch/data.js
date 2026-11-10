/*
 * What the architecture diagram (ArchDiagram.svelte) draws besides its boxes: the flows (the
 * chips; every element tags itself with data-flow) and the edges.
 */
export const flows = [
	{ key: 'playback', label: 'Media path' },
	{ key: 'control', label: 'Library & downloads' },
	{ key: 'picture', label: 'Picture mode' },
	{ key: 'phone', label: 'Phone & web' }
];

/*
 * The edges, one group per data-flow. A straight edge runs `from` → `to`, a curve follows `d`;
 * each stops a head short of its target, and its head (ArchDiagram's chevron) carries it on to
 * the tip. `optional` and `faint` mark the dashed ones.
 */
export const edgeGroups = [
	{
		flow: 'playback',
		edges: [{ id: 'direct-play', from: [300, 110], to: [387, 110] }],
		labels: [{ x: 348, y: 98, anchor: 'middle', text: 'Direct Play' }]
	},
	{
		flow: 'playback control',
		edges: [{ id: 'rest', from: [300, 156], to: [387, 156] }],
		labels: [{ x: 348, y: 144, anchor: 'middle', text: 'REST API' }]
	},
	{
		flow: 'playback',
		edges: [{ id: 'earc', from: [260, 176], to: [260, 395] }],
		labels: [
			{ x: 250, y: 362, anchor: 'end', text: 'DD+ · Atmos · DTS' },
			{ x: 250, y: 378, anchor: 'end', text: 'bitstream over eARC' }
		]
	},
	{
		flow: 'picture',
		edges: [{ id: 'loopback', from: [100, 176], to: [100, 213] }],
		labels: [{ x: 110, y: 204, text: 'loopback HTTP' }]
	},
	{
		flow: 'control',
		edges: [{ id: 'api', d: 'M300,166 C350,166 345,290 387,290', optional: true }],
		labels: [{ x: 356, y: 232, text: '/api · streams' }]
	},
	{
		flow: 'control',
		edges: [{ id: 'token', from: [550, 246], to: [550, 189] }],
		labels: [{ x: 560, y: 218, text: 'checks the Jellyfin token' }]
	},
	{
		flow: 'control',
		edges: [
			{ id: 'sonarr', from: [434, 332], to: [434, 371] },
			{ id: 'radarr', from: [530, 332], to: [530, 371] },
			{ id: 'qbittorrent', from: [663, 332], to: [663, 371] }
		],
		labels: [{ x: 653, y: 360, anchor: 'end', text: 'download' }]
	},
	{
		// Sonarr and Radarr search through Prowlarr, under and between them
		flow: 'control',
		edges: [
			{ id: 'sonarr-prowlarr', from: [434, 418], to: [462.8, 446.8] },
			{ id: 'radarr-prowlarr', from: [530, 418], to: [501.2, 446.8] }
		]
	},
	{
		flow: 'control',
		edges: [{ id: 'internet', d: 'M700,310 C745,310 740,400 767,400', faint: true }]
	},
	{
		flow: 'phone',
		edges: [
			{ id: 'hls', from: [800, 122], to: [713, 122], optional: true },
			{ id: 'web', d: 'M800,206 C750,206 745,276 713,276', optional: true }
		],
		labels: [{ x: 752, y: 112, anchor: 'middle', text: 'HLS remux' }]
	}
];
