<script>
	import { personalLinks } from '#lib/personal-links.js';

	// ~25 s loop of Rosie walking a path and doing skits; ~800 KB, so it is only fetched on the first hover
	const SKITS_URL = '/footer/rosie-skits.webp';

	let skits; // Promise<Blob>
	let hovering = $state(false);
	let src = $state(); // a fresh blob: URL per hover, so the loop restarts at its first frame
	let stopTimer;

	function swap(next) {
		if (src) URL.revokeObjectURL(src);
		src = next;
	}

	async function play() {
		hovering = true;
		clearTimeout(stopTimer);
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		skits ??= fetch(SKITS_URL).then((response) => response.blob());
		const blob = await skits;
		if (hovering) swap(URL.createObjectURL(blob));
	}

	function stop() {
		hovering = false;
		// Drop the animation once it has faded out, so it stops decoding
		stopTimer = setTimeout(() => swap(undefined), 300);
	}
</script>

<footer>
	<div class="footer-content">
		<!-- Decorative pixel art of Rosie: still image, skits on hover (mouseenter/leave
		     rather than pointer events, so a tap on touch screens keeps her going) -->
		<div
			class="image-container"
			class:playing={hovering && src}
			role="presentation"
			onmouseenter={play}
			onmouseleave={stop}
		>
			<img src="/footer/rosie-static.png" alt="" class="static" />
			<img {src} alt="" class="skits" />
		</div>
		<p>Created by Kirill</p>
		<!-- The nav bar has no room for these on phones -->
		<div class="personal-links">
			{#each personalLinks as link (link.label)}
				<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
			{/each}
		</div>
	</div>
</footer>

<style>
	footer {
		padding-top: 6rem;
		padding-bottom: 4rem;
	}

	@media (min-width: 640px) {
		footer {
			padding-top: 10rem;
			padding-bottom: 5rem;
		}
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 5rem;
	}

	/* The box around Rosie is the hover area; the images overflow it and ignore the pointer,
	   so hovering the path beside her does nothing */
	.image-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 5rem;
		min-height: 5rem;
	}

	img {
		transition: opacity 0.3s ease;
		position: absolute;
		pointer-events: none;
	}

	.static {
		height: 3rem;
	}

	/* Wider and taller than the box: the path runs out to both sides and the room above her
	   head is for jumps and emotes, so the image is anchored near the bottom of the box,
	   lifted a little to keep the grass off the text below */
	.skits {
		bottom: 0.3rem;
		height: 6.868rem;
	}

	.playing .static,
	.image-container:not(.playing) .skits {
		opacity: 0;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-font-light);
	}

	.personal-links {
		display: flex;
		gap: 0.25rem;
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.personal-links a {
		/* Comfortable tap target around short labels */
		padding: 0.5rem 0.75rem;
		color: var(--color-font-light);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.personal-links a:hover,
	.personal-links a:focus-visible {
		color: var(--color-font-dark);
	}

	@media (min-width: 640px) {
		.personal-links {
			display: none;
		}
	}
</style>
