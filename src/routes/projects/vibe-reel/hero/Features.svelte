<script>
	/*
	 * The hero's three features, like a magazine's contents: a large outlined gold numeral
	 * beside each name in serif, a muted line under it.
	 *
	 * Sized in em, so that the stage can scale them all. The stage is the container their
	 * queries ask about: three abreast from 600 px, and from 880 px beside the set, one under
	 * the other again. Each comes in with the page's .enter once the TV has powered on (after
	 * Hero's --power-at), --i of them apart.
	 */
	let { features } = $props();
</script>

<ul class="features">
	{#each features as { name, line }, i (name)}
		<li class="feature enter" style:--i={i}>
			<span class="numeral" aria-hidden="true">{i + 1}</span>
			<div class="text">
				<span class="name">{name}</span>
				<p>{line}</p>
			</div>
		</li>
	{/each}
</ul>

<style>
	.features {
		list-style: none;
		display: grid;
		gap: 1.5em;
		margin: 0;
		padding: 0;
	}

	.feature {
		--name: 1.35em;
		--enter-duration: 333ms;
		--enter-delay: calc(var(--power-at) + 567ms + var(--i) * 73ms);
		--enter-y: 0.75rem;
		--enter-ease: var(--ease-cubic-out);
		display: flex;
		align-items: flex-start;
		gap: 0.8em;
	}

	.text {
		min-width: 0;
	}

	.name {
		font-family: var(--font-secondary);
		font-size: var(--name);
		line-height: 1.25;
		color: var(--color-font-dark);
	}

	.feature p {
		max-width: 38ch;
		margin: 0.35em 0 0;
		font-size: 0.95em;
		line-height: 1.55;
		color: var(--vr-muted);
	}

	/* Outlined, standing as tall as the name and the line's first two rows */
	.numeral {
		flex: none;
		width: 1.1em;
		font-family: var(--font-secondary);
		font-size: 3.4em;
		line-height: 0.85;
		color: transparent;
		-webkit-text-stroke: 1.25px var(--vr-gold);
		text-align: center;
	}

	/* Three abreast under the set while there is room for them */
	@container (600px <= width < 880px) {
		.features {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}

		.feature {
			--name: 1.2em;
		}

		.feature p {
			font-size: 0.9em;
		}

		.numeral {
			font-size: 2.6em;
		}
	}

	@container (width >= 880px) {
		.features {
			gap: 2em;
		}

		.feature {
			--name: 1.45em;
		}
	}
</style>
