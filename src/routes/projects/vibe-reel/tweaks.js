/*
 * The refinements on trial on the VibeReel page, for the dev-only Tweaks panel
 * (#lib/components/TweakPanel.svelte). Each item is one proposed change: its default (`value`)
 * is the page as it ships and comes first, the other options are the proposals, and `where`
 * is the part of the page it changes, which the panel brings into view.
 *
 * The page keeps the values and provides them through context; a component reads one with
 * `const tweak = useTweaks()` and `tweak('hero.blurb')`, in markup or a $derived, so that it
 * follows the panel. Once a proposal is picked, bake it into the code and drop its item here;
 * with none left, the panel and this file go.
 */
import { getContext } from 'svelte';

/** The page's tweak values, live: returns `(key) => value` */
export function useTweaks() {
	const values = getContext('tweaks');
	return (key) => values()[key];
}

/** The last line of the page (+page.svelte), by `page.end` */
export const END_LINES = {
	watch: 'Now go watch something.',
	thanks: 'Thanks for watching.'
};

export const sections = [
	{
		legend: 'Hero',
		reset: true,
		folded: false,
		items: [
			{
				type: 'choice',
				key: 'hero.blurb',
				label: 'Blurb',
				where: '.hero .page-subtitle',
				value: 'grey',
				options: [
					{
						value: 'grey',
						label: 'Grey sans',
						about: 'As it ships: the site’s pale grey subtitle, the lightest text on the page (2.7:1 on the paper).'
					},
					{
						value: 'ink',
						label: 'Ink sans',
						about: 'The same type in the grey of the page’s running text, like the feature lines beside the TV.'
					},
					{
						value: 'lede',
						label: 'Handwritten',
						about: 'In the notes’ italic serif, as every section’s lede is: the page’s own lede.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.opening',
				label: 'Title on load',
				where: '.hero .page-heading',
				value: 'still',
				options: [
					{
						value: 'still',
						label: 'Still',
						about: 'As it ships: title and blurb are simply there while the TV draws itself.'
					},
					{
						value: 'focus',
						label: 'Focus pull',
						about: 'They come into focus as the page opens, the way each section does on scroll. Pick Still and this again to replay; after a reload it starts a beat late, as the panel’s picks load after the page.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.source',
				label: 'Source link, pointed at',
				where: '.hero .meta',
				value: 'grey',
				options: [
					{
						value: 'grey',
						label: 'Fade to grey',
						about: 'As it ships: hovered, the words fade from ink to mid grey (the gold it once faded to, drained).'
					},
					{
						value: 'marker',
						label: 'Highlighter',
						about: 'Hovered, a band of the sketchbook’s gold sweeps in behind the words, as behind Direct Play and the device on show. No underline.'
					},
					{
						value: 'sepia',
						label: 'Sepia ink',
						about: 'Hovered, the words fade to the tickets’ sepia.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.pen',
				label: 'Soundbar pen',
				where: '.hero .soundbar',
				value: 'own',
				options: [
					{
						value: 'own',
						label: 'Own pen',
						about: 'As it ships: its outline 1.8 px, under a TV drawn at 1.1 px.'
					},
					{
						value: 'medium',
						label: 'Halfway',
						about: 'Outline 1.45 px, the rest in step.'
					},
					{
						value: 'fine',
						label: 'TV’s pen',
						about: 'Every line at the TV’s weight, so that set and bar read as one drawing.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.light',
				label: 'Power light',
				where: '.hero .tv-box',
				value: 'ring',
				options: [
					{
						value: 'ring',
						label: 'Ring',
						about: 'As it ships: the little light on the TV’s chin is an empty ring.'
					},
					{
						value: 'lit',
						label: 'Lit',
						about: 'It comes on with the picture: one dot of gold, here and on the Shape-shifter’s TV.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.laptop',
				label: 'Window 1024–1279 px wide',
				where: '.hero .stage',
				value: 'beside',
				options: [
					{
						value: 'beside',
						label: 'Note beside',
						about: 'As it ships: at that width the features reach up into the Source note and its arrow crosses the 1. Narrow the window to see.'
					},
					{
						value: 'above',
						label: 'Note above',
						about: 'At that width the note takes a row above the TV, as on narrower pages. Wider windows stay as they are.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.shot',
				label: 'Seconds per shot',
				where: '.hero .tv-box',
				value: 12,
				options: [
					{
						value: 12,
						label: '12 s',
						about: 'As it ships: “200% longer” read as three times the old 4 s.'
					},
					{ value: 8, label: '8 s', about: 'Twice the old 4 s, if that was the meaning.' }
				]
			}
		]
	},
	{
		legend: 'Film strip',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'strip.count',
				label: 'Caption number',
				where: '.filmstrip .captions',
				value: 'one',
				options: [
					{
						value: 'one',
						label: '01',
						about: 'As it ships: only the frame’s own number.'
					},
					{
						value: 'of',
						label: '01 / 04',
						about: 'With the total, so the caption says how much film there is to pull.'
					}
				]
			}
		]
	},
	{
		legend: 'Shape-shifter',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'morph.tabs',
				label: 'Devices not on show',
				where: '.morph .picker',
				value: 'pale',
				options: [
					{
						value: 'pale',
						label: 'Pale',
						about: 'As it ships: their names in the site’s light grey, paler than the small print under them.'
					},
					{
						value: 'inked',
						label: 'Inked',
						about: 'Names in the running text’s grey and the small print a step lighter, so they read as things to pick.'
					}
				]
			}
		]
	},
	{
		legend: 'Architecture',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'arch.media',
				label: 'Media path',
				where: '.arch',
				value: 'same',
				options: [
					{
						value: 'same',
						label: 'Same pen',
						about: 'As it ships: drawn like every other line; only its chip’s swatch is a shade darker.'
					},
					{
						value: 'firm',
						label: 'Firmer pen',
						about: 'Direct Play and the bitstream to the soundbar in a heavier, darker line: the one path that always runs. No gold.'
					}
				]
			},
			{
				type: 'choice',
				key: 'arch.hint',
				label: 'Scroll hint (under 760 px)',
				where: '.arch',
				value: 'sans',
				options: [
					{
						value: 'sans',
						label: 'Sans',
						about: 'As it ships: “Scroll sideways →” in the body sans, on a narrow page.'
					},
					{
						value: 'note',
						label: 'Handwritten',
						about: 'In the notes’ italic, as “pull the film sideways” is. Narrow the window to see.'
					}
				]
			}
		]
	},
	{
		legend: 'Downloads',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'downloads.rest',
				label: 'Pieces still missing',
				where: '.bar-wrap',
				value: 'grey',
				options: [
					{
						value: 'grey',
						label: 'Cool grey',
						about: 'As it ships: a neutral grey, the one cold tone on the warm sheet.'
					},
					{
						value: 'paper',
						label: 'Paper',
						about: 'A darker shade of the sheet itself.'
					},
					{
						value: 'outline',
						label: 'Outlined',
						about: 'Empty boxes in pencil: not there yet.'
					}
				]
			},
			{
				type: 'choice',
				key: 'downloads.lanes',
				label: 'TV · iPhone & web',
				where: '.lanes',
				value: 'cards',
				options: [
					{
						value: 'cards',
						label: 'White cards',
						about: 'As it ships: two white cards with sans small caps, the page’s last app-style boxes.'
					},
					{
						value: 'frames',
						label: 'Pencil frames',
						about: 'Framed and lettered like the machines in the architecture diagram.'
					},
					{
						value: 'notes',
						label: 'Bare notes',
						about: 'No boxes: the same lettering under a pencil rule.'
					}
				]
			}
		]
	},
	{
		legend: 'Trailers',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'trailers.columns',
				label: 'Stage spacing',
				where: '.timeline',
				value: 'words',
				options: [
					{
						value: 'words',
						label: 'By words',
						about: 'As it ships: each column as wide as its words are long, which keeps them to two lines and spaces the dots unevenly.'
					},
					{
						value: 'even',
						label: 'Even',
						about: 'Four equal columns: a steady beat. On a panel under about 1420 px the first stage’s words run to three or four lines.'
					}
				]
			},
			{
				type: 'choice',
				key: 'trailers.rail',
				label: 'Rail and dots',
				where: '.timeline',
				value: 'faint',
				options: [
					{
						value: 'faint',
						label: 'Faint',
						about: 'As it ships: a pale rail that hardly shows, under sepia rings.'
					},
					{
						value: 'pencil',
						label: 'Pencil',
						about: 'Rail and dots in the architecture diagram’s pencil.'
					}
				]
			}
		]
	},
	{
		legend: 'Whole page',
		reset: true,
		folded: true,
		items: [
			{
				type: 'choice',
				key: 'page.wrap',
				label: 'Line breaks',
				where: '#tv .lede',
				value: 'plain',
				options: [
					{
						value: 'plain',
						label: 'As they fall',
						about: 'As it ships: lines fill up and the last is often short (“the TV remote.”).'
					},
					{
						value: 'balanced',
						label: 'Balanced',
						about: 'The blurb, ledes, feature lines, captions and paragraphs break into lines of even length.'
					}
				]
			},
			{
				type: 'choice',
				key: 'page.focus',
				label: 'Focus pull on scroll',
				where: '#phone',
				value: 'long',
				options: [
					{
						value: 'long',
						label: 'Over 14 rem',
						about: 'As it ships: a block is sharp once it is 14 rem into the window, so what rests in the bottom fifth of a tall one stays soft.'
					},
					{
						value: 'short',
						label: 'Over 8 rem',
						about: 'Sharp sooner: the soft band along the foot of the window is little more than half as deep. Scroll to see.'
					}
				]
			},
			{
				type: 'choice',
				key: 'page.subgap',
				label: 'Room over a sub-heading',
				where: '#downloads',
				value: 'close',
				options: [
					{
						value: 'close',
						label: '3.5 rem',
						about: 'As it ships: “Watch while it downloads” and “YouTube trailers” follow close under the ticket before them.'
					},
					{
						value: 'roomy',
						label: '5 rem',
						about: 'More air over each, so that the three tickets read as three parts.'
					}
				]
			},
			{
				type: 'choice',
				key: 'page.ticket',
				label: 'Tickets in Firefox & Safari',
				where: '.arch',
				value: 'browser',
				options: [
					{
						value: 'browser',
						label: 'Browser’s',
						about: 'As it ships: without corner-shape (Firefox, Safari) a ticket has no shadow and its perforation runs square into the scoops.'
					},
					{
						value: 'same',
						label: 'As in Chrome',
						about: 'Shadow and scooped perforation drawn by other means, the same in every browser.'
					}
				]
			},
			{
				type: 'choice',
				key: 'page.end',
				label: 'Last line',
				where: '.vr-end',
				value: 'none',
				options: [
					{
						value: 'none',
						label: 'Nothing',
						about: 'As it ships: the page stops after the trailer timeline.'
					},
					{ value: 'watch', label: 'Go watch', about: `“${END_LINES.watch}”` },
					{ value: 'thanks', label: 'Thanks', about: `“${END_LINES.thanks}”` }
				]
			}
		]
	}
];
