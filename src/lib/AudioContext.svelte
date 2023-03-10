<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { type Ctx, setCtx } from './context';

	const dispatch = createEventDispatcher();

	const state = writable<AudioContextState>('suspended');

	let audioCtx: AudioContext;

	let ctx: Ctx = {
		audioCtx: undefined as unknown as AudioContext,
		state: { subscribe: state.subscribe }
	};

	setCtx(ctx);

	function statechange() {
		state.set(audioCtx.state);
	}

	let analyser: AnalyserNode;

	async function init() {
		audioCtx = new AudioContext();
		ctx.audioCtx = audioCtx;

		try {
			await audioCtx.resume();
		} catch (error) {
			dispatch('error', error);
			return;
		}

		audioCtx.addEventListener('statechange', statechange);

		analyser = new AnalyserNode(audioCtx);

		analyser.connect(audioCtx.destination);
	}

	onMount(() => {
		document.addEventListener('click', init, { once: true });

		return () => {
			document.removeEventListener('click', init);
			audioCtx?.removeEventListener('statechange', statechange);
		};
	});
</script>

{#if $state === 'running'}
	<p>running</p>
	<slot {audioCtx} />
{:else if $state === 'suspended'}
	<p>click</p>
{:else if $state === 'closed'}
	<p>closed</p>
{/if}
