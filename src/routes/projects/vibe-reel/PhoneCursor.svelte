<script>
	/*
	 * The touch cursor over the live phone: a grease pencil (cursor/pencil.js), painted on a
	 * canvas laid over the demo's screen inside the demo's own document (cursor/layer.js) in
	 * place of the demo's cursor, an ensō. Unmounted, it takes it all out of the demo again.
	 */
	import { layer } from './cursor/layer.js';
	import pencil from './cursor/pencil.js';

	let { frame } = $props();

	$effect(() => layer(frame, pencil));
</script>
