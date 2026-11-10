<script>
	import Shell from './Shell.svelte';
	import { spread, imageUrl, polar, fmt } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// A cathedral rose window: 24 flags in the outer ring, 12 in the inner one, each a pane of
	// glass with its top facing out, behind lead cames and a frosted centre with the count.
	const rings = [
		{ name: 'outer', flags: spread(24), r1: 27, r2: 46, offset: 0 },
		{
			name: 'inner',
			flags: spread(36).filter((_, k) => k % 3 === 1),
			r1: 15,
			r2: 27,
			offset: 0.5
		}
	].map((ring) => {
		const n = ring.flags.length;
		const half = 0.5 / n;
		const pts = [polar(ring.r1, -half), polar(ring.r2, -half)];
		const clip =
			`M${pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L')}` +
			`A${ring.r2} ${ring.r2} 0 0 1 ${fmt(-pts[1][0])} ${fmt(pts[1][1])}` +
			`L${fmt(-pts[0][0])} ${fmt(pts[0][1])}` +
			`A${ring.r1} ${ring.r1} 0 0 0 ${fmt(pts[0][0])} ${fmt(pts[0][1])}Z`;
		// Each pane covers a box as tall as the ring and a little wider than its outer edge
		const h = ring.r2 - ring.r1 + 1;
		const w = 2 * ring.r2 * Math.tan(Math.PI / n) + 2;
		const panes = ring.flags.map((f, k) => ({
			code: f.code,
			rotate: fmt(((k + ring.offset) * 360) / n)
		}));
		const cames = ring.flags.map((_, k) => {
			const t = (k + ring.offset + 0.5) / n;
			const [x1, y1] = polar(ring.r1, t);
			const [x2, y2] = polar(ring.r2, t);
			return { k, d: `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}` };
		});
		return { ...ring, clip, w: fmt(w), h, panes, cames };
	});

	const uid = $props.id();
</script>

<!-- Rose window: flags as stained glass; the light comes up on hover -->
<Shell {project} {linkSection}>
	<svg class="window" viewBox="-50 -50 100 100" aria-hidden="true">
		<defs>
			{#each rings as ring (ring.name)}
				<clipPath id="{uid}-{ring.name}"><path d={ring.clip} /></clipPath>
			{/each}
			<!-- Old glass is never flat: a slow ripple through every pane -->
			<filter id="{uid}-glass" x="-5%" y="-5%" width="110%" height="110%">
				<feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="7" />
				<feDisplacementMap
					in="SourceGraphic"
					scale="2.2"
					xChannelSelector="R"
					yChannelSelector="G"
				/>
			</filter>
			<radialGradient id="{uid}-light" cx="0.38" cy="0.32" r="0.75">
				<stop offset="0" stop-color="#fff" stop-opacity="0.35" />
				<stop offset="0.6" stop-color="#fff" stop-opacity="0" />
				<stop offset="1" stop-color="#000" stop-opacity="0.25" />
			</radialGradient>
		</defs>
		<g class="glass" filter="url(#{uid}-glass)">
			{#each rings as ring (ring.name)}
				{#each ring.panes as p (p.code)}
					<g transform="rotate({p.rotate})" clip-path="url(#{uid}-{ring.name})">
						<image
							href={imageUrl(p.code)}
							x={-ring.w / 2}
							y={-ring.r2 - 0.5}
							width={ring.w}
							height={ring.h}
							preserveAspectRatio="xMidYMid slice"
						/>
					</g>
				{/each}
			{/each}
			<circle r="15" fill="#f6f1e6" />
		</g>
		<circle r="46" fill="url(#{uid}-light)" />
		<g class="lead">
			{#each rings as ring (ring.name)}
				{#each ring.cames as c (c.k)}
					<path d={c.d} />
				{/each}
			{/each}
			<circle r="15" />
			<circle r="27" />
			<circle r="46" class="frame" />
		</g>
	</svg>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">flags</span>
	</h2>
</Shell>

<style>
	.window {
		position: absolute;
		left: 9%;
		top: 13%;
		width: 82%;
		overflow: visible;
		filter: saturate(0.9) brightness(0.97);
		transition: filter 0.6s ease;
	}

	:global(.tile:hover) .window {
		filter: saturate(1.25) brightness(1.08)
			drop-shadow(0 0 3cqw color-mix(in oklch, gold 35%, transparent));
	}

	.lead {
		fill: none;
		stroke: #2a2723;
		stroke-width: 0.9;
		stroke-linecap: round;
	}

	.frame {
		stroke-width: 2.4;
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
	}

	.count {
		font-size: 10cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.7rem, 3.6cqw);
		color: var(--color-font-light);
	}
</style>
