<script lang="ts">
	import { onMount } from 'svelte';
	import { setCtx } from './context';

	let ctx: AudioContext;

	let resolveResumed: () => void;
	let rejectResumed: (error: unknown) => void;
	const resumedPromise = new Promise<void>((resolve, reject) => {
		resolveResumed = resolve;
		rejectResumed = reject;
	});
	let resumed = false;

	let analyser: AnalyserNode;

	async function init() {
		ctx = new AudioContext();

		try {
			await ctx.resume();
			resolveResumed();
			resumed = true;
		} catch (error) {
			rejectResumed(error);
			resumed = false;
			return;
		}

		analyser = new AnalyserNode(ctx);

		analyser.connect(ctx.destination);
	}

	setCtx({ get: () => ctx, resumed: () => resumed });

	onMount(() => {
		document.addEventListener('click', init, { once: true });

		return () => {
			document.removeEventListener('click', init);
		};
	});
</script>

{#await resumedPromise}
	<p>click</p>
{:then}
	<p>resumed</p>
	<slot {ctx} />
{:catch error}
	<p>error: {error}</p>
{/await}
