<script>
	import { personalLinks } from '#lib/personal-links.js';
</script>

<footer>
	<div class="footer-content">
		<!-- Decorative pixel art of Josie: still image, animated on hover -->
		<div class="image-container">
			<img src="/footer/rosie-static.png" alt="" class="static" />
			<img src="/footer/footer-animation.gif" alt="" class="gif" />
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

	.image-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 5rem;
	}

	img {
		transition: opacity 0.3s ease;
		position: absolute;
	}

	.static {
		height: 3rem;
	}

	.gif {
		height: 5rem;
	}

	.image-container:hover .static,
	.image-container:not(:hover) .gif {
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
