<script>
	/*
	 * The hero's three features: each name in serif after its number, a muted line under it.
	 * The numbers are written as the film strip's captions have theirs (TvScreens' .count): in
	 * the edge print's mono on a stroke of highlighter, on the name's first line.
	 *
	 * Sized in em, so that the stage can scale them all. The stage is the container their
	 * queries ask about: three abreast from 600 px, and from 880 px beside the set, one under
	 * the other again. On a phone (under 600 px) they stand under the set and are centred as
	 * it is: the number over the name, the line under it. A line comes in its phrases (`line`
	 * is a list of them), and there it breaks between them, not within one, as long as a
	 * phrase has room on a line. Each feature comes in with the page's .enter once the TV has
	 * powered on (after Hero's --power-at), --i of them apart.
	 */
	let { features } = $props();
</script>

<ul class="features">
	{#each features as { name, line }, i (name)}
		<li class="feature enter" style:--i={i}>
			<span class="numeral" aria-hidden="true">0{i + 1}</span>
			<div class="text">
				<span class="name">{name}</span>
				<p>
					{#each line as phrase, j (j)}{j ? ' ' : ''}<span class="phrase">{phrase}</span
						>{/each}
				</p>
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

	/* On a phone a name steps down with the sections' headings (--vr-sub), and so keeps to one
	   line on a narrow one */
	.feature {
		--name: min(1.35em, var(--vr-sub));
		--enter-duration: 333ms;
		--enter-delay: calc(var(--power-at) + 567ms + var(--i) * 73ms);
		--enter-y: 0.75rem;
		--enter-ease: var(--ease-cubic-out);
		display: flex;
		align-items: baseline;
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

	/* The stroke of highlighter hangs out to the left by its own padding, so that the digits
	   keep to the column's edge; on the right the last digit's spacing is part of its room */
	.numeral {
		flex: none;
		margin-left: -0.3em;
		padding: 0.1em 0.18em 0.05em 0.3em;
		font: 0.9em var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--vr-gold-ink);
		background: var(--vr-wash);
		border-radius: 0.2em 0.45em 0.35em 0.25em;
	}

	/* On a phone: centred under the centred set, the number over the name, and the line broken
	   between its phrases (each a box that wraps as a whole, and only inside itself when it is
	   wider than the column) */
	@container (width < 600px) {
		.features {
			gap: 2em;
		}

		.feature {
			flex-direction: column;
			align-items: center;
			gap: 0.45em;
			text-align: center;
		}

		.numeral {
			margin-left: 0;
		}

		.feature p {
			max-width: none;
		}

		.phrase {
			display: inline-block;
			text-wrap: balance;
		}
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
