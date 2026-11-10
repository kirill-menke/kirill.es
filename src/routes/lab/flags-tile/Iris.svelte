<script>
	import Shell from './Shell.svelte';
	import { flags, N, polar, fmt } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// An eye whose iris is the circle: one wedge per flag, its colours stacked outwards by share,
	// dominant colour on the rim so the gradient runs round the edge.
	const R_IN = 11;
	const R_OUT = 46;
	const quad = (r1, r2, t1, t2) => {
		const p = [polar(r1, t1), polar(r1, t2), polar(r2, t2), polar(r2, t1)];
		return `M${p.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L')}Z`;
	};
	const bands = flags.flatMap((f, i) => {
		const t1 = i / N;
		const t2 = (i + 1.04) / N; // a hair of overlap hides the seams
		let r = R_OUT;
		return f.colors.map((c) => {
			const inner = r - c.share * (R_OUT - R_IN);
			const d = quad(inner, r, t1, t2);
			r = inner;
			return { key: `${f.code}-${c.hex}`, d, fill: c.hex };
		});
	});

	const uid = $props.id();
</script>

<!-- Iris: an eye of every flag's colours; the pupil widens on hover -->
<Shell {project} {linkSection}>
	<svg class="eye" viewBox="-50 -50 100 100" aria-hidden="true">
		<defs>
			<radialGradient id="{uid}-shade">
				<stop offset="0.55" stop-color="#000" stop-opacity="0" />
				<stop offset="0.93" stop-color="#000" stop-opacity="0.18" />
				<stop offset="1" stop-color="#000" stop-opacity="0.5" />
			</radialGradient>
		</defs>
		<g class="iris">
			{#each bands as b (b.key)}
				<path d={b.d} fill={b.fill} />
			{/each}
		</g>
		<circle r={R_OUT} fill="url(#{uid}-shade)" />
		<circle r={R_OUT} fill="none" stroke="#1b1b1b" stroke-opacity="0.6" stroke-width="0.8" />
		<circle class="pupil" fill="#141414" />
		<ellipse class="glint" cx="-11" cy="-11" rx="3.2" ry="2" transform="rotate(-45 -11 -11)" />
	</svg>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">flags</span>
	</h2>
</Shell>

<style>
	.eye {
		position: absolute;
		left: 9%;
		top: 13%;
		width: 82%;
		overflow: visible;
	}

	.iris {
		animation: spin 160s linear infinite;
	}

	.pupil {
		r: 17px;
		transition: r 0.7s var(--ease-back-in-out);
	}

	:global(.tile:hover) .pupil {
		r: 21px;
	}

	.glint {
		fill: white;
		opacity: 0.85;
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 54%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-secondary);
		color: white;
	}

	.count {
		font-size: 11cqw;
		line-height: 1;
	}

	.caption {
		font-size: max(0.7rem, 3.8cqw);
		opacity: 0.7;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.iris {
			animation: none;
		}
	}
</style>
