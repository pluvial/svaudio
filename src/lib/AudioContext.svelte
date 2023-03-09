<script lang="ts">
	import { onMount } from 'svelte';
	import { setCtx } from './context';

	let ctx: AudioContext;

	setCtx({ get: () => ctx });

	let analyser: AnalyserNode;

	async function init() {
		ctx ??= new AudioContext();
		if (ctx.state !== 'running') await ctx.resume();

		analyser = new AnalyserNode(ctx);

		analyser.connect(ctx.destination);
	}

	onMount(() => {
		async function click() {
			await init();
			document.removeEventListener('click', click);
		}

		document.addEventListener('click', click);

		return () => {
			document.removeEventListener('click', click);
		};
	});
</script>

<slot {ctx} />
