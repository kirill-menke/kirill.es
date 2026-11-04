<!-- Sequence diagram: how the jailed app gets a picture mode changed -->
<figure class="seq">
	<p class="hint" aria-hidden="true">Scroll sideways →</p>
	<div class="scroll">
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

			{#each [{ x: 90, t: 'TV app', s: 'jailed web app' }, { x: 300, t: 'Companion', s: 'root, outside the jail' }, { x: 510, t: 'Luna hub', s: 'checks permissions' }, { x: 710, t: 'settingsservice', s: 'owns pictureMode' }] as l (l.t)}
				<rect class="head" x={l.x - 80} y="10" width="160" height="50" rx="10" />
				<text class="head-title" x={l.x} y="32" text-anchor="middle">{l.t}</text>
				<text class="head-sub" x={l.x} y="50" text-anchor="middle">{l.s}</text>
				<line class="life" x1={l.x} y1="60" x2={l.x} y2="320" />
			{/each}

			<rect class="badge" x="430" y="78" width="160" height="40" rx="8" />
			<text class="badge-text" x="510" y="94" text-anchor="middle">registered as</text>
			<text class="badge-text mono" x="510" y="110" text-anchor="middle"
				>multiviewsettings-reel</text
			>

			<line class="msg" x1="90" y1="150" x2="296" y2="150" marker-end="url(#seq-arrow)" />
			<text class="msg-text mono" x="100" y="142">GET /picture?mode=filmMaker</text>

			<line class="msg" x1="300" y1="190" x2="706" y2="190" marker-end="url(#seq-arrow)" />
			<text class="msg-text mono" x="310" y="182">getSystemSettings</text>
			<text class="msg-text" x="610" y="182" text-anchor="end">passes the hub ✓</text>

			<line
				class="msg reply"
				x1="710"
				y1="225"
				x2="304"
				y2="225"
				marker-end="url(#seq-arrow)"
			/>
			<text class="msg-text" x="700" y="217" text-anchor="end"
				>the live dimension (signal type)</text
			>

			<line class="msg" x1="300" y1="262" x2="706" y2="262" marker-end="url(#seq-arrow)" />
			<text class="msg-text mono" x="310" y="254"
				>setSystemSettings &#123; pictureMode, dimension &#125;</text
			>

			<line
				class="msg reply"
				x1="300"
				y1="300"
				x2="94"
				y2="300"
				marker-end="url(#seq-arrow)"
			/>
			<text class="msg-text" x="290" y="292" text-anchor="end">current mode</text>
		</svg>
	</div>
</figure>

<style>
	.hint {
		display: none;
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	@media (max-width: 760px) {
		.hint {
			display: block;
		}
	}

	.seq {
		margin: 0;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		.seq {
			padding: 2rem;
		}
	}

	.scroll {
		overflow-x: auto;
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
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		fill: var(--vr-gold-ink);
	}
</style>
