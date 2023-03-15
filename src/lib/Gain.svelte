<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getCtx, setCtxOutput } from './context';

	type $$Props = GainOptions;

	export let gain: $$Props['gain'] = undefined;

	export let channelCount: $$Props['channelCount'] = undefined;
	export let channelCountMode: $$Props['channelCountMode'] = undefined;
	export let channelInterpretation: $$Props['channelInterpretation'] = undefined;

	const { audioCtx, output } = getCtx();

	const options = {
		gain,
		channelCount,
		channelCountMode,
		channelInterpretation
	} satisfies GainOptions;

	const node = new GainNode(audioCtx, options);

	node.connect(output);

	setCtxOutput(node);

	$: if (typeof gain === 'number' && gain !== options.gain) {
		node.gain.setValueAtTime(gain, 0);
		options.gain = gain;
	}

	onDestroy(() => node.disconnect(output));
</script>

<slot />
