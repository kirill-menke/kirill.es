/*
 * The refinements on trial on the VibeReel page, for the dev-only Tweaks panel
 * (#lib/components/TweakPanel.svelte). Each item is one proposed change: its default (`value`,
 * the option with the dot in the panel) is the page as it ships, the other options are the
 * proposals, and `where` is the part of the page it changes, which the panel brings into view.
 *
 * Two rounds so far. The sections called "New" hold the second round's proposals. The first
 * round's sections follow them: Kirill's picks of 2026-11-11 are their defaults now, and what
 * the page did before them stays to switch back to ("As it was").
 *
 * The page keeps the values and provides them through context; a component reads one with
 * `const tweak = useTweaks()` and `tweak('hero.blurb')`, in markup or a $derived, so that it
 * follows the panel. Once the picks are final, bake them into the code and drop their items
 * here; with none left, the panel and this file go.
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
		legend: 'New · Hero',
		reset: true,
		folded: false,
		items: [
			{
				type: 'choice',
				key: 'hero.numerals',
				label: 'Fact numbers',
				where: '.hero .features',
				value: 'outline',
				options: [
					{
						value: 'outline',
						label: 'Outlined',
						about: 'As it ships: large numerals in outline, in the pencil’s grey.'
					},
					{
						value: 'washed',
						label: 'Washed',
						about: 'The same outlines over a wash of the sketchbook’s gold that has slipped a little off them, as on the TV’s nameplate.'
					},
					{
						value: 'circled',
						label: 'Circled',
						about: 'Small numerals in ink, each circled by hand in pencil.'
					},
					{
						value: 'marker',
						label: 'Highlighter',
						about: '01 to 03 in the film’s edge-print mono on a stroke of the gold, as the film strip’s captions are numbered.'
					},
					{
						value: 'tally',
						label: 'Tally marks',
						about: 'Counted off in pencil strokes: one, two, three.'
					},
					{
						value: 'hand',
						label: 'Handwritten',
						about: 'In the notes’ italic, like the Source note over them.'
					}
				]
			},
			{
				type: 'choice',
				key: 'hero.speakers',
				label: 'Soundbar speakers',
				where: '.hero .soundbar',
				value: 'bare',
				options: [
					{
						value: 'bare',
						label: 'Bare',
						about: 'As it ships: the grilles hatched on the bar’s grey wash. With the marker gone from Direct Play, the bar has no gold.'
					},
					{
						value: 'gold',
						label: 'Gold wash',
						about: 'Both grilles washed in the sketchbook’s gold, as the TV’s nameplate is. A bar under 640 px has no grilles: on a phone, and in a window 1024–1279 px wide.'
					},
					{
						value: 'deep',
						label: 'Deeper gold',
						about: 'The same wash laid on twice as strong, for the hatching to stand on.'
					}
				]
			}
		]
	},
	{
		// Each detail of the strip by itself, so that any of them can be tried together
		legend: 'New · Film strip in gold',
		reset: true,
		folded: false,
		items: [
			{
				type: 'toggle',
				key: 'strip.holes',
				label: 'Sprocket holes',
				where: '.filmstrip .reel',
				value: false
			},
			{
				type: 'toggle',
				key: 'strip.lines',
				label: 'Frame lines (the hatched gaps)',
				where: '.filmstrip .reel',
				value: false
			},
			{
				type: 'toggle',
				key: 'strip.print',
				label: 'Edge print',
				where: '.filmstrip .reel',
				value: false
			},
			{
				type: 'toggle',
				key: 'strip.ending',
				label: 'Last frame (pull the film to its end)',
				where: '.filmstrip .reel',
				value: false
			}
		]
	},
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
				value: 'ink',
				options: [
					{
						value: 'grey',
						label: 'Grey sans',
						about: 'As it was: the site’s pale grey subtitle, the lightest text on the page (2.7:1 on the paper).'
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
				value: 'marker',
				options: [
					{
						value: 'grey',
						label: 'Fade to grey',
						about: 'As it was: hovered, the words fade from ink to mid grey (the gold it once faded to, drained).'
					},
					{
						value: 'marker',
						label: 'Highlighter',
						about: 'Hovered, a band of the sketchbook’s gold sweeps in behind the words, as behind the device on show in the Shape-shifter. No underline.'
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
				value: 'fine',
				options: [
					{
						value: 'own',
						label: 'Own pen',
						about: 'As it was: its outline 1.8 px, under a TV drawn at 1.1 px.'
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
				value: 'lit',
				options: [
					{
						value: 'ring',
						label: 'Ring',
						about: 'As it was: the little light on the TV’s chin is an empty ring.'
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
				value: 'above',
				options: [
					{
						value: 'beside',
						label: 'Note beside',
						about: 'As it was: at that width the features reach up into the Source note and its arrow crosses the 1. Narrow the window to see.'
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
				value: 8,
				options: [
					{ value: 12, label: '12 s', about: 'As it was: three times the old 4 s.' },
					{ value: 8, label: '8 s', about: 'Twice the old 4 s.' }
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
				value: 'of',
				options: [
					{
						value: 'one',
						label: '01',
						about: 'As it was: only the frame’s own number.'
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
				value: 'inked',
				options: [
					{
						value: 'pale',
						label: 'Pale',
						about: 'As it was: their names in the site’s light grey, paler than the small print under them.'
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
						about: 'As it ships: drawn like every other line.'
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
				value: 'note',
				options: [
					{
						value: 'sans',
						label: 'Sans',
						about: 'As it was: “Scroll sideways →” in the body sans, on a narrow page.'
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
				value: 'outline',
				options: [
					{
						value: 'grey',
						label: 'Cool grey',
						about: 'As it was: a neutral grey, the one cold tone on the warm sheet.'
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
				value: 'frames',
				options: [
					{
						value: 'cards',
						label: 'White cards',
						about: 'As it was: two white cards with sans small caps, the page’s last app-style boxes.'
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
				value: 'even',
				options: [
					{
						value: 'words',
						label: 'By words',
						about: 'As it was: each column as wide as its words are long, which keeps them to two lines and spaces the dots unevenly.'
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
				value: 'pencil',
				options: [
					{
						value: 'faint',
						label: 'Faint',
						about: 'As it was: a pale rail that hardly shows, under sepia rings.'
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
				value: 'balanced',
				options: [
					{
						value: 'plain',
						label: 'As they fall',
						about: 'As it was: lines fill up and the last is often short (“the TV remote.”).'
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
				value: 'roomy',
				options: [
					{
						value: 'close',
						label: '3.5 rem',
						about: 'As it was: “Watch while it downloads” and “YouTube trailers” follow close under the ticket before them.'
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
				value: 'same',
				options: [
					{
						value: 'browser',
						label: 'Browser’s',
						about: 'As it was: without corner-shape (Firefox, Safari) a ticket has no shadow and its perforation runs square into the scoops.'
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
				label: 'Last line (halfway to the footer)',
				where: '.vr-end',
				value: 'thanks',
				options: [
					{
						value: 'none',
						label: 'Nothing',
						about: 'As it was: the page stops after the trailer timeline.'
					},
					{ value: 'watch', label: 'Go watch', about: `“${END_LINES.watch}”` },
					{ value: 'thanks', label: 'Thanks', about: `“${END_LINES.thanks}”` }
				]
			}
		]
	}
];
