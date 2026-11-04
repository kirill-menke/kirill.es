<script>
	/** A page section: a claim heading, a one-line lede, the body and optional code notes */
	let { id, heading, lede = '', children, code } = $props();
</script>

<section {id} class="vr-section">
	<h2>{heading}</h2>
	{#if lede}
		<p class="lede">{lede}</p>
	{/if}
	<div class="body">
		{@render children()}
	</div>
	{#if code}
		<details>
			<summary>In the code</summary>
			<div class="code-notes">
				{@render code()}
			</div>
		</details>
	{/if}
</section>

<style>
	.vr-section {
		margin: 5rem 0;
		scroll-margin-top: 2rem;
	}

	h2 {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: 2rem;
		line-height: 1.2;
		color: var(--color-font-dark);
		margin: 0 0 0.5rem;
		max-width: 34ch;
	}

	@media (min-width: 640px) {
		h2 {
			font-size: 2.4rem;
		}
	}

	.lede {
		font-size: 1.1rem;
		color: var(--color-font-light);
		margin: 0 0 1.75rem;
		max-width: 65ch;
	}

	.body :global(p),
	.body :global(li) {
		color: var(--vr-muted);
		line-height: 1.65;
		max-width: 70ch;
	}

	.body :global(code),
	.code-notes :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
		padding: 0.1em 0.35em;
		border-radius: 0.3rem;
	}

	.body :global(strong) {
		color: var(--color-font-dark);
		font-weight: 500;
	}

	details {
		margin-top: 1.5rem;
		border-radius: 0.5rem;
		background: var(--color-background-tile);
		max-width: 80ch;
	}

	summary {
		cursor: pointer;
		padding: 0.75rem 1.25rem;
		font-size: 0.9rem;
		color: var(--color-font-light);
		transition: color 0.1s linear;
	}

	summary:hover,
	details[open] summary {
		color: var(--color-font-dark);
	}

	.code-notes {
		padding: 0 1.25rem 1rem;
		font-size: 0.9rem;
	}

	.code-notes :global(li),
	.code-notes :global(p) {
		color: var(--vr-muted);
		line-height: 1.6;
	}

	.code-notes :global(ul) {
		padding-left: 1.1rem;
		margin: 0;
	}
</style>
