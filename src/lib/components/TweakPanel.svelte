<script module>
	/** The default of every item in `sections` (each item's `value`), keyed by the item's key. */
	export const defaultsOf = (sections) =>
		Object.fromEntries(sections.flatMap((s) => s.items).map((item) => [item.key, item.value]));
</script>

<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/env';

	/*
	 * A floating panel for trying out variations of a page while developing. It starts in the
	 * bottom-right corner; drag its header to move it anywhere (double-click the header to send it
	 * back). Only the dev server shows it (see `show`), so it never reaches the built site.
	 *
	 *   let tweaks = $state(defaultsOf(sections));
	 *   <TweakPanel {sections} bind:values={tweaks} storage="my-page-tweaks" />
	 *
	 * sections: [{ legend, items, reset?, folded? }], each a block under a small-caps heading; with
	 *   `reset` it ends in a button that puts its items back to their defaults, and with `folded`
	 *   (true or false: how it starts) its heading folds it away. Items:
	 *   { type: 'choice', key, value, options: [{ value, label, about?, group? }], label?, keys? }
	 *     a grid of options to pick one from: three columns when every label fits, else two, so
	 *     keep labels to a word or two. A dot marks the default. `label` heads the
	 *     grid, the picked option's `about` shows under it (and every option's on hover), a new
	 *     `group` starts a sub-heading, and with `keys` the number keys 1–9 pick options too.
	 *   { type: 'range', key, value, label, min, max, step }  a slider showing its value
	 *   { type: 'toggle', key, value, label }  a switch
	 *   `value` is the item's default.
	 * values: key -> current value, edited in place. Bind it to a $state object.
	 * storage: a localStorage key to keep the values (and which sections are folded, and where the
	 *   panel was dragged to) under across reloads, or null. Only the values that differ from their
	 *   defaults are kept, so a default changed in the code shows on reload wherever it wasn't
	 *   changed in the panel. A blob saved before that (every value, without `changed`) is dropped.
	 *
	 * Make each item's `value` the page as it ships: the built site has no panel, so it renders
	 * the defaults. Components further down read the values through context, from a getter so
	 * that they stay reactive: the page calls `setContext('tweaks', () => tweaks)`, a component
	 * `const tweaks = getContext('tweaks')` and then `tweaks()['area.key']` in markup or $derived.
	 * Once the variations are settled, bake the picked values into the code and drop the panel.
	 */
	let { sections = [], values = $bindable(), storage = null, show = dev } = $props();

	let open = $state(true);
	// Sections folded or unfolded by hand, by legend; the rest are as their `folded` says
	let folds = $state({});
	let loaded = false;

	let panel = $state();
	// Top-left corner in px once dragged; null keeps the panel in the bottom-right corner
	let position = $state(null);
	let drag = $state(null);
	const MARGIN = 8;

	// Keeps the whole panel on screen
	function clamp({ x, y }) {
		const { width, height } = panel.getBoundingClientRect();
		return {
			x: Math.max(MARGIN, Math.min(x, window.innerWidth - width - MARGIN)),
			y: Math.max(MARGIN, Math.min(y, window.innerHeight - height - MARGIN))
		};
	}

	function reclamp() {
		if (position && panel) position = clamp(position);
	}

	// Folding a section or the panel changes its height, which could push it off screen
	$effect(() => {
		if (!panel) return;
		const observer = new ResizeObserver(reclamp);
		observer.observe(panel);
		return () => observer.disconnect();
	});

	function savePosition() {
		if (!storage) return;
		if (position) localStorage.setItem(`${storage}:position`, JSON.stringify(position));
		else localStorage.removeItem(`${storage}:position`);
	}

	function startDrag(event) {
		if (event.button !== 0 || event.target.closest('button')) return;
		const rect = panel.getBoundingClientRect();
		drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
		event.currentTarget.setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	function moveDrag(event) {
		if (drag) position = clamp({ x: event.clientX - drag.dx, y: event.clientY - drag.dy });
	}

	function endDrag() {
		if (!drag) return;
		drag = null;
		savePosition();
	}

	function toCorner(event) {
		if (event.target.closest('button')) return;
		position = null;
		savePosition();
	}

	onMount(() => {
		// Folded on a phone, where it would cover the page
		open = window.innerWidth >= 640;
		if (storage) {
			try {
				const saved = JSON.parse(localStorage.getItem(storage) ?? '{}');
				// Only keys the page still has, so renamed or dropped tweaks fall away
				const changed = saved?.changed ?? {};
				for (const key of Object.keys(defaultsOf(sections)))
					if (key in changed) values[key] = changed[key];
			} catch {
				// A broken saved value just means the defaults
			}
			try {
				folds = JSON.parse(localStorage.getItem(`${storage}:folds`) ?? '{}');
			} catch {
				// Likewise
			}
			try {
				position = JSON.parse(localStorage.getItem(`${storage}:position`) ?? 'null');
			} catch {
				// Likewise
			}
		}
		loaded = true;
	});

	// Saved: only what differs from its default
	$effect(() => {
		const defaults = defaultsOf(sections);
		const changed = Object.fromEntries(
			Object.entries(values).filter(
				([key, value]) => JSON.stringify(value) !== JSON.stringify(defaults[key])
			)
		);
		const json = JSON.stringify({ changed });
		if (storage && loaded) localStorage.setItem(storage, json);
	});

	$effect(() => {
		const json = JSON.stringify(folds);
		if (storage && loaded) localStorage.setItem(`${storage}:folds`, json);
	});

	const foldable = (section) => section.legend && section.folded !== undefined;
	const isFolded = (section) => foldable(section) && (folds[section.legend] ?? section.folded);

	let shortcuts = $derived(
		sections.flatMap((s) => s.items).find((item) => item.type === 'choice' && item.keys)
	);

	function onkeydown(event) {
		if (!show || !shortcuts) return;
		if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const option = shortcuts.options[Number(event.key) - 1];
		if (option) values[shortcuts.key] = option.value;
	}

	function reset(section) {
		for (const item of section.items) values[item.key] = item.value;
	}

	// An item's options split at each new `group`, each with its index in the whole list (for
	// the number keys)
	function partsOf(options) {
		const parts = [];
		options.forEach((option, i) => {
			if (i === 0 || option.group !== options[i - 1].group)
				parts.push({ group: option.group, options: [] });
			parts.at(-1).options.push({ option, i });
		});
		return parts;
	}

	// Three columns when every label of the grid fits in one, else two; measured again once the
	// web fonts have loaded, since they change the labels' widths
	function columns(grid) {
		const fit = () => {
			grid.classList.add('three');
			const names = [...grid.querySelectorAll('.name')];
			grid.classList.toggle(
				'three',
				names.every((n) => n.scrollWidth <= n.clientWidth)
			);
		};
		fit();
		document.fonts.ready.then(fit);
	}

	const aboutOf = (item) => item.options.find((o) => o.value === values[item.key])?.about;
</script>

<svelte:window {onkeydown} onresize={reclamp} />

{#if show}
	<aside
		bind:this={panel}
		class="tweaks"
		class:open
		class:placed={position}
		class:dragging={drag}
		style:left={position && `${position.x}px`}
		style:top={position && `${position.y}px`}
		aria-label="Tweaks"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			onpointerdown={startDrag}
			onpointermove={moveDrag}
			onpointerup={endDrag}
			onpointercancel={endDrag}
			ondblclick={toCorner}
		>
			<span class="grip" aria-hidden="true"></span>
			<h2>Tweaks</h2>
			<button
				class="collapse"
				onclick={() => (open = !open)}
				aria-expanded={open}
				aria-label={open ? 'Collapse' : 'Expand'}
			>
				{open ? '–' : '+'}
			</button>
		</header>

		{#if open}
			<div class="body">
				{#each sections as section, s (s)}
					<fieldset class:folded={isFolded(section)}>
						{#if foldable(section)}
							<legend>
								<button
									class="fold"
									onclick={() => (folds[section.legend] = !isFolded(section))}
									aria-expanded={!isFolded(section)}
								>
									{section.legend}
									<span class="chevron">{isFolded(section) ? '+' : '–'}</span>
								</button>
							</legend>
						{:else if section.legend}
							<legend>{section.legend}</legend>
						{/if}
						{#each isFolded(section) ? [] : section.items as item (item.key)}
							{#if item.type === 'choice'}
								{#if item.label}<span class="group">{item.label}</span>{/if}
								{#each partsOf(item.options) as part, p (p)}
									{#if part.group}<span class="group">{part.group}</span>{/if}
									<div class="options" {@attach columns}>
										{#each part.options as { option, i } (option.value)}
											<label
												class="option"
												class:active={values[item.key] === option.value}
												class:default={option.value === item.value}
												title={option.about}
											>
												<input
													type="radio"
													name={item.key}
													value={option.value}
													bind:group={values[item.key]}
												/>
												{#if item.keys && i < 9}<kbd>{i + 1}</kbd>{/if}
												<span class="name">{option.label}</span>
											</label>
										{/each}
									</div>
								{/each}
								{#if aboutOf(item)}<p class="about">{aboutOf(item)}</p>{/if}
							{:else if item.type === 'range'}
								<label class="range">
									<span>{item.label}</span>
									<input
										type="range"
										min={item.min}
										max={item.max}
										step={item.step}
										bind:value={values[item.key]}
									/>
									<output>{values[item.key]}</output>
								</label>
							{:else if item.type === 'toggle'}
								<label class="toggle">
									<input type="checkbox" bind:checked={values[item.key]} />
									<span>{item.label}</span>
								</label>
							{/if}
						{/each}
						{#if section.reset && !isFolded(section)}
							<button class="reset" onclick={() => reset(section)}>Reset</button>
						{/if}
					</fieldset>
				{/each}
			</div>
		{/if}
	</aside>
{/if}

<style>
	.tweaks {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 1002;
		display: flex;
		flex-direction: column;
		width: min(22rem, calc(100vw - 2rem));
		max-height: min(36rem, calc(100svh - 2rem));
		overflow: hidden;
		border: 0.5px solid var(--color-border);
		border-radius: 0.8rem;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(8px);
		box-shadow: var(--shadow-float);
		font-size: 0.8rem;
		color: var(--color-font-dark);
	}

	.tweaks.placed {
		right: auto;
		bottom: auto;
	}

	.tweaks:not(.open) {
		width: auto;
	}

	header {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.6rem;
		padding: 0.45rem 0.5rem 0.45rem 0.8rem;
		border-bottom: 0.5px solid var(--color-border);
		cursor: grab;
		user-select: none;
		touch-action: none;
	}

	.tweaks:not(.open) header {
		border-bottom: 0;
	}

	.dragging header {
		cursor: grabbing;
	}

	/* Six dots, the usual "drag me" mark */
	.grip {
		width: 0.45rem;
		height: 0.75rem;
		background: radial-gradient(circle, var(--color-font-light) 1px, transparent 1.3px) 0 0 /
			0.225rem 0.25rem;
	}

	h2 {
		flex: 1;
		margin: 0;
		font-family: var(--font-secondary);
		font-size: 1.05rem;
		font-weight: normal;
	}

	.collapse {
		width: 1.6rem;
		height: 1.6rem;
		border: 0;
		border-radius: 0.4rem;
		background: none;
		font: inherit;
		font-size: 1rem;
		color: var(--color-font-light);
		cursor: pointer;
	}

	.collapse:hover {
		background: var(--color-background-tile-hover);
		color: var(--color-font-dark);
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.1rem 0.9rem 0.4rem;
	}

	.chevron {
		padding-left: 1rem;
		color: var(--color-font-light);
	}

	/* Chrome puts a fieldset's top padding below its legend, so the spacing lives on the legend */
	fieldset {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		margin: 0;
		padding: 0 0 0.6rem;
		border: 0;
		border-top: 0.5px solid var(--color-border);
	}

	fieldset:first-child {
		border-top: 0;
	}

	fieldset.folded {
		padding-bottom: 0;
	}

	legend,
	.group {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-font-light);
	}

	legend {
		width: 100%;
		padding: 0.55rem 0 0.45rem;
		font-weight: 600;
		color: var(--color-font-dark);
	}

	legend:has(.fold) {
		padding: 0;
	}

	.fold {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0.55rem 0 0.45rem;
		border: 0;
		background: none;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: inherit;
		cursor: pointer;
	}

	.folded .fold {
		color: var(--color-font-light);
	}

	.fold:hover,
	.folded .fold:hover {
		color: var(--color-font-dark);
	}

	.group {
		padding: 0.35rem 0 0.25rem;
	}

	.options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.25rem;
	}

	/* Set by `columns` */
	.options:global(.three) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.option {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.5rem;
		border: 0.5px solid var(--color-border);
		border-radius: 0.45rem;
		cursor: pointer;
	}

	.option:hover {
		background: var(--color-background-tile-hover);
	}

	.option.active {
		border-color: var(--color-font-dark);
		background: var(--color-background-dark);
	}

	/* The default, the page as it ships */
	.option.default::after {
		content: '';
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: var(--color-font-dark);
	}

	.option input,
	.toggle input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.option:has(input:focus-visible),
	.toggle:has(input:focus-visible) {
		outline: 1px solid var(--color-font-dark);
	}

	kbd {
		flex-shrink: 0;
		width: 1.1rem;
		padding: 0.05rem 0;
		border: 0.5px solid var(--color-border);
		border-radius: 0.25rem;
		background: white;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		text-align: center;
		color: var(--color-font-light);
	}

	.name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.about {
		margin: 0.3rem 0 0.1rem;
		font-size: 0.7rem;
		line-height: 1.35;
		color: var(--color-font-light);
	}

	.range {
		display: grid;
		grid-template-columns: 9.5rem 1fr 2.5rem;
		align-items: center;
		gap: 0.4rem;
		padding: 0.15rem 0;
	}

	.range input {
		width: 100%;
		accent-color: var(--color-font-dark);
	}

	output {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-align: right;
		color: var(--color-font-light);
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.2rem 0;
		cursor: pointer;
	}

	.toggle span::before {
		content: '';
		display: inline-block;
		width: 1.6rem;
		height: 0.9rem;
		margin-right: 0.5rem;
		vertical-align: -0.2rem;
		border-radius: 1rem;
		background: var(--color-background-dark)
			radial-gradient(circle at 0.45rem 50%, white 0.32rem, transparent 0.34rem);
		transition: background 0.15s ease;
	}

	.toggle input:checked + span::before {
		background: var(--color-font-dark)
			radial-gradient(circle at 1.15rem 50%, white 0.32rem, transparent 0.34rem);
	}

	.reset {
		align-self: flex-start;
		margin-top: 0.3rem;
		padding: 0.2rem 0.6rem;
		border: 0.5px solid var(--color-border);
		border-radius: 1rem;
		background: white;
		font: inherit;
		font-size: 0.7rem;
		color: var(--color-font-light);
		cursor: pointer;
	}

	.reset:hover {
		color: var(--color-font-dark);
	}
</style>
