<script>
	/**
	 * Pick one of a few options: a radio group with a roving tabindex, so Tab enters and leaves
	 * the group and the arrow keys (plus Home/End) move the choice.
	 * `options` is a list of { value, label }; `variant` is 'segmented' or 'pills'.
	 */
	let { options, value = $bindable(), label, variant = 'segmented' } = $props();

	const steps = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };

	function onkeydown(event) {
		const n = options.length;
		const i = options.findIndex((o) => o.value === value);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? n - 1
					: event.key in steps
						? (i + steps[event.key] + n) % n
						: -1;
		if (next === -1) return;
		event.preventDefault();
		value = options[next].value;
		event.currentTarget.parentElement.children[next].focus();
	}
</script>

<div class="switcher {variant}" role="radiogroup" aria-label={label}>
	{#each options as o (o.value)}
		<button
			type="button"
			role="radio"
			aria-checked={o.value === value}
			tabindex={o.value === value ? 0 : -1}
			onclick={() => (value = o.value)}
			{onkeydown}
		>
			{o.label}
		</button>
	{/each}
</div>

<style>
	button {
		font: inherit;
		color: var(--color-font-light);
		padding: 0.4rem 1rem;
		cursor: pointer;
		transition: all 0.1s linear;
	}

	button:hover {
		color: var(--color-font-dark);
	}

	/* One bordered bar of tabs */
	.segmented {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: var(--color-background);
		border: 0.5px solid var(--color-border);
		border-radius: 0.6rem;
		margin-bottom: 1.75rem;
	}

	.segmented button {
		font-size: 0.9rem;
		border: 0;
		background: transparent;
		border-radius: 0.4rem;
	}

	/* Separate, wrapping pills */
	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 1.25rem;
	}

	.pills button {
		font-size: 0.85rem;
		border: 0.5px solid var(--color-border);
		background: var(--color-background);
		padding: 0.4rem 0.9rem;
		border-radius: 2rem;
	}

	/* Last, so it beats the variants' backgrounds and borders */
	button[aria-checked='true'] {
		background: var(--vr-ink);
		border-color: var(--vr-ink);
		color: white;
	}
</style>
