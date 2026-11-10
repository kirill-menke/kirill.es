<script>
	/*
	 * One screenshot as a frame of the film strip shows it: the picture alone, no TV round it,
	 * its edges dissolving into the paper (see the styles). It shows `<name>-bleed.webp`, the
	 * shot run on past its edges, for `src`.
	 */
	let { src, alt } = $props();
</script>

<div class="picture">
	<img
		src={src.replace(/\.webp$/, '-bleed.webp')}
		{alt}
		width="1600"
		height="1040"
		loading="lazy"
		decoding="async"
	/>
</div>

<style>
	/* A border round the whole picture, its colours fading out across it into the paper and
	   breaking up into grain at its outer edge, as if rubbed on in graphite. The border is the
	   picture itself run on past its edges, so nothing marks where the one ends and the other
	   begins: the img is `<name>-bleed.webp`, the shot with 160px more of it all round
	   (1600 × 1040), laid so that its middle 1280 × 720 fills the content box and the rest
	   reaches out over the padding (all of it on any picture wider than 160px). Out there each
	   pixel is the shot's edge carried straight out (its nearest edge pixel) and blurred by a
	   Gaussian of σ its distance from the shot (scripts/bleed-shots.mjs makes them; run it again
	   when a shot changes). So the first pixels out are the edge's own, only what lies at the
	   edge shows past it, and what the edge cuts through softens into a glow. The fade across
	   the padding eases into the picture (smoothstep, 3t² − 2t³), so it levels off there
	   instead of turning a corner that would show as a line.

	   Both are images made once rather than effects worked out on every paint, so that the film
	   strip scrolls smoothly (the frames repaint as they dim). The grain is dissolve-mask.png, a
	   soft rectangle thresholded against noise (rendered from an SVG filter: blur 8, fractal
	   noise 0.65, arithmetic 2.2·soft − noise − 0.25, alpha stepped at 0.5, in an 800 × 450 box
	   with the rectangle 6 in). It is opaque from 13 of those units in, inside the border's
	   1.25rem on any frame wider than about 160px, so the screenshot itself is never cut. */
	.picture {
		--pad: 1.25rem;
		--ramp:
			transparent, rgb(0 0 0 / 0.04) calc(var(--pad) * 0.125),
			rgb(0 0 0 / 0.16) calc(var(--pad) * 0.25), rgb(0 0 0 / 0.32) calc(var(--pad) * 0.375),
			rgb(0 0 0 / 0.5) calc(var(--pad) * 0.5), rgb(0 0 0 / 0.68) calc(var(--pad) * 0.625),
			rgb(0 0 0 / 0.84) calc(var(--pad) * 0.75), rgb(0 0 0 / 0.96) calc(var(--pad) * 0.875),
			#000 var(--pad), #000 calc(100% - var(--pad)),
			rgb(0 0 0 / 0.96) calc(100% - var(--pad) * 0.875),
			rgb(0 0 0 / 0.84) calc(100% - var(--pad) * 0.75),
			rgb(0 0 0 / 0.68) calc(100% - var(--pad) * 0.625),
			rgb(0 0 0 / 0.5) calc(100% - var(--pad) * 0.5),
			rgb(0 0 0 / 0.32) calc(100% - var(--pad) * 0.375),
			rgb(0 0 0 / 0.16) calc(100% - var(--pad) * 0.25),
			rgb(0 0 0 / 0.04) calc(100% - var(--pad) * 0.125), transparent;
		position: relative;
		aspect-ratio: 16 / 9;
		padding: var(--pad);
		overflow: hidden;
		mask:
			url('/project-previews/vibe-reel/dissolve-mask.png') 0 0 / 100% 100% no-repeat,
			linear-gradient(to right, var(--ramp)),
			linear-gradient(to bottom, var(--ramp));
		mask-composite: intersect;
	}

	/* 160 of the bleed's 1600 × 1040 is an eighth of the shot's width and two ninths of its
	   height, either side */
	.picture img {
		position: absolute;
		left: calc(var(--pad) - (100% - 2 * var(--pad)) / 8);
		top: calc(var(--pad) - (100% - 2 * var(--pad)) * 2 / 9);
		width: calc((100% - 2 * var(--pad)) * 1.25);
		height: calc((100% - 2 * var(--pad)) * 13 / 9);
		object-fit: cover;
	}
</style>
