<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { type Ctx, setCtx } from './context';

	const dispatch = createEventDispatcher();

	const state = writable<AudioContextState>('suspended');

	let audioCtx: AudioContext;

	// TODO: revisit forced type assertions
	let ctx: Ctx = {
		audioCtx: undefined as unknown as AudioContext,
		output: undefined as unknown as AudioNode,
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
		ctx.output = audioCtx.destination;

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

	// TODO: revisit event types, listeners on window, document, or body?

	const types = ['click', 'pointerdown', 'keydown', 'keypress'];

	const addListeners = () =>
		types.forEach((type) => window.addEventListener(type, interaction, { once: true }));

	const removeListeners = () =>
		types.forEach((type) => window.removeEventListener(type, interaction));

	function interaction() {
		init();
		removeListeners();
	}

	onMount(() => {
		addListeners();
		return () => {
			removeListeners();
			audioCtx?.removeEventListener('statechange', statechange);
		};
	});
</script>

{#if $state === 'running'}
	<slot {audioCtx} />
{:else if $state === 'suspended'}
	<slot name="suspended" />
{:else if $state === 'closed'}
	<slot name="closed" />
{/if}
