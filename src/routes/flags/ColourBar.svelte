<script>
	let { colors } = $props();

	const GAP = 8; // px between two labels in a row

	const percent = (share) => Math.round(share * 100);

	// Each colour's label belongs under the middle of its segment, as a share of the bar
	let labels = $derived.by(() => {
		const total = colors.reduce((sum, c) => sum + c.share, 0);
		let before = 0;
		return colors
			.map((c) => {
				const middle = (before + c.share / 2) / total;
				before += c.share;
				return { ...c, middle };
			})
			.filter((c) => percent(c.share) >= 1);
	});

	let room = $state(0); // the bar's width
	let widths = $state([]); // each label's, measured

	// Labels fill a row in the bar's order and start the next one when it is full. In a row,
	// overlapping labels move apart as a block, centred on where they would like to be.
	function place(wants, sizes) {
		const spots = [];
		const fit = (x, w) => (w >= room ? (room - w) / 2 : Math.min(Math.max(x, 0), room - w));
		let i = 0;
		for (let row = 0; i < wants.length; row++) {
			const blocks = [];
			let used = -GAP;
			for (
				;
				i < wants.length && (blocks.length === 0 || used + GAP + sizes[i] <= room);
				i++
			) {
				used += GAP + sizes[i];
				let block = {
					from: i,
					to: i,
					width: sizes[i],
					sum: wants[i] - sizes[i] / 2,
					count: 1
				};
				block.start = fit(block.sum, block.width);
				for (
					let prev = blocks.at(-1);
					prev && prev.start + prev.width + GAP > block.start;
				) {
					blocks.pop();
					const shift = prev.width + GAP; // how far right of the block's start the labels moved
					block = {
						from: prev.from,
						to: block.to,
						width: shift + block.width,
						sum: prev.sum + block.sum - block.count * shift,
						count: prev.count + block.count
					};
					block.start = fit(block.sum / block.count, block.width);
					prev = blocks.at(-1);
				}
				blocks.push(block);
			}
			for (const block of blocks) {
				let x = block.start;
				for (let k = block.from; k <= block.to; k++) {
					spots[k] = { x, row };
					x += sizes[k] + GAP;
				}
			}
		}
		return spots;
	}

	let spots = $derived(
		room && labels.every((_, i) => widths[i] > 0)
			? place(
					labels.map((c) => c.middle * room),
					widths.slice(0, labels.length)
				)
			: null
	);
	let rows = $derived(spots ? Math.max(...spots.map((s) => s.row)) + 1 : 1);
</script>

<div
	class="bar"
	role="img"
	aria-label={labels.map((c) => `${c.name} ${percent(c.share)}%`).join(', ')}
>
	{#each colors as c (c.hex)}
		<span
			class="segment"
			style="flex-grow: {c.share}; background: {c.hex}"
			title="{c.name} {(c.share * 100).toFixed(1)}%"
		></span>
	{/each}
</div>
<p class="legend" style="--rows: {rows}" bind:clientWidth={room}>
	{#each labels as c, i (c.hex)}
		<span
			class="entry"
			class:placed={spots}
			style={spots
				? `transform: translate(${spots[i].x}px, ${spots[i].row * 100}%)`
				: `left: ${c.middle * 100}%`}
			bind:offsetWidth={widths[i]}>{c.name} {percent(c.share)}%</span
		>
	{/each}
</p>

<style>
	.bar,
	.legend {
		width: 90%;
	}

	.bar {
		display: flex;
		height: 0.75rem;
		border-radius: 0.25rem;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.segment {
		flex-basis: 0;
		min-width: 2px;
		box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.06);
	}

	.legend {
		position: relative;
		height: calc(var(--rows) * 1.4em);
		margin: 0.45rem 0 0;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--color-font-dark);
	}

	/* Until the labels are measured, each is centred on its segment */
	.entry {
		position: absolute;
		top: 0;
		white-space: nowrap;
		transform: translateX(-50%);
	}

	.entry.placed {
		left: 0;
	}
</style>
