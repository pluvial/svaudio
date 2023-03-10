<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getCtx } from './context';

	type $$Props = OscillatorOptions & {};

	export let detune: $$Props['detune'] = undefined;
	export let periodicWave: $$Props['periodicWave'] = undefined;
	export let frequency: $$Props['frequency'] = undefined;
	export let type: $$Props['type'] = undefined;

	export let channelCount: $$Props['channelCount'] = undefined;
	export let channelCountMode: $$Props['channelCountMode'] = undefined;
	export let channelInterpretation: $$Props['channelInterpretation'] = undefined;

	const { audioCtx, output } = getCtx();

	const options = {
		detune,
		periodicWave,
		frequency,
		type,
		channelCount,
		channelCountMode,
		channelInterpretation
	} satisfies OscillatorOptions;

	const node = new OscillatorNode(audioCtx, options);

	node.connect(output);

	node.start();

	$: if (typeof detune === 'number' && detune !== options.detune) {
		node.detune.setValueAtTime(detune, 0);
		options.detune = detune;
	}

	$: if (typeof frequency === 'number' && frequency !== options.frequency) {
		node.frequency.setValueAtTime(frequency, 0);
		options.frequency = frequency;
	}

	onDestroy(() => node.disconnect(output));
</script>

<slot />
