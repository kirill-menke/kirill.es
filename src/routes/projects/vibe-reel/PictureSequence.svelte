<script>
	/* Sequence diagram: how the jailed app gets a picture mode changed */
	const lifelines = [
		{ x: 90, title: 'TV app', sub: 'jailed web app' },
		{ x: 300, title: 'Companion', sub: 'root, outside the jail' },
		{ x: 510, title: 'Luna hub', sub: 'checks permissions' },
		{ x: 710, title: 'settingsservice', sub: 'owns pictureMode' }
	];

	/* Each label sits just above its arrow, starting at the arrow's tail */
	const messages = [
		{ y: 150, from: 90, to: 296, label: 'GET /picture?mode=filmMaker', mono: true },
		{
			y: 190,
			from: 300,
			to: 706,
			label: 'getSystemSettings',
			mono: true,
			note: { x: 610, text: 'passes the hub ✓' }
		},
		{ y: 225, from: 710, to: 304, label: 'the live dimension (signal type)', reply: true },
		{
			y: 262,
			from: 300,
			to: 706,
			label: 'setSystemSettings { pictureMode, dimension }',
			mono: true
		},
		{ y: 300, from: 300, to: 94, label: 'current mode', reply: true }
	];
</script>

<figure class="seq vr-panel">
	<p class="vr-hint" aria-hidden="true">Scroll sideways →</p>
	<div class="vr-scroll">
		<svg viewBox="0 0 800 330" role="img" aria-labelledby="seq-title seq-desc">
			<title id="seq-title">Picture-mode switch sequence</title>
			<desc id="seq-desc">
				The TV app calls the companion service on loopback port 8791. The companion,
				registered on the Luna bus under the Multi-View Settings app's identity, reads the
				live signal dimension from settingsservice, then sets the picture mode for that
				dimension and answers the app.
			</desc>
			<defs>
				<marker
					id="seq-arrow"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="10"
					markerHeight="10"
					orient="auto-start-reverse"
					markerUnits="userSpaceOnUse"
				>
					<path d="M0,0 L10,5 L0,10 z" class="arrowhead" />
				</marker>
			</defs>

			{#each lifelines as l (l.title)}
				<rect class="head" x={l.x - 80} y="10" width="160" height="50" rx="10" />
				<text class="head-title" x={l.x} y="32" text-anchor="middle">{l.title}</text>
				<text class="head-sub" x={l.x} y="50" text-anchor="middle">{l.sub}</text>
				<line class="life" x1={l.x} y1="60" x2={l.x} y2="320" />
			{/each}

			<rect class="badge" x="430" y="78" width="160" height="40" rx="8" />
			<text class="badge-text" x="510" y="94" text-anchor="middle">registered as</text>
			<text class="badge-text mono" x="510" y="110" text-anchor="middle"
				>multiviewsettings-reel</text
			>

			{#each messages as m (m.y)}
				{@const rightwards = m.to > m.from}
				<line
					class="msg"
					class:reply={m.reply}
					x1={m.from}
					y1={m.y}
					x2={m.to}
					y2={m.y}
					marker-end="url(#seq-arrow)"
				/>
				<text
					class="msg-text"
					class:mono={m.mono}
					x={rightwards ? m.from + 10 : m.from - 10}
					y={m.y - 8}
					text-anchor={rightwards ? 'start' : 'end'}>{m.label}</text
				>
				{#if m.note}
					<text class="msg-text" x={m.note.x} y={m.y - 8} text-anchor="end"
						>{m.note.text}</text
					>
				{/if}
			{/each}
		</svg>
	</div>
</figure>

<style>
	.seq {
		container-type: inline-size;
	}

	/* The svg's min-width below */
	@container (width < 640px) {
		.vr-hint {
			display: block;
		}
	}

	svg {
		display: block;
		width: 100%;
		min-width: 640px;
		max-width: 900px;
		margin: 0 auto;
		height: auto;
		font-family: var(--font-primary);
	}

	.head {
		fill: var(--vr-cream);
		stroke: var(--vr-gold);
		stroke-width: 1.5;
	}

	.head-title {
		font-size: 14px;
		font-weight: 500;
		fill: var(--vr-ink);
	}

	.head-sub {
		font-size: 11px;
		fill: var(--vr-muted);
	}

	.life {
		stroke: oklch(0.85 0 0);
		stroke-dasharray: 4 4;
	}

	.badge {
		fill: var(--color-background);
		stroke: var(--vr-gold-fill);
		stroke-width: 1.5;
	}

	.badge-text {
		font-size: 11px;
		fill: var(--vr-muted);
	}

	.msg {
		stroke: var(--vr-ink);
		stroke-width: 1.5;
	}

	.msg.reply {
		stroke: var(--vr-edge);
		stroke-dasharray: 5 4;
	}

	.arrowhead {
		fill: var(--vr-ink);
	}

	.msg-text {
		font-size: 12px;
		fill: var(--vr-muted);
	}

	.mono {
		font-family: var(--font-mono);
		fill: var(--vr-gold-ink);
	}
</style>
