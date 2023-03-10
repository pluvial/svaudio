<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getCtx, setCtxOutput } from './context';

	type $$Props = BiquadFilterOptions & {};

	export let Q: $$Props['Q'] = undefined;
	export let detune: $$Props['detune'] = undefined;
	export let frequency: $$Props['frequency'] = undefined;
	export let gain: $$Props['gain'] = undefined;
	export let type: $$Props['type'] = undefined;

	export let channelCount: $$Props['channelCount'] = undefined;
	export let channelCountMode: $$Props['channelCountMode'] = undefined;
	export let channelInterpretation: $$Props['channelInterpretation'] = undefined;

	const { audioCtx, output } = getCtx();

	const options = {
		Q,
		detune,
		frequency,
		gain,
		type,
		channelCount,
		channelCountMode,
		channelInterpretation
	} satisfies BiquadFilterOptions;

	const node = new BiquadFilterNode(audioCtx, options);

	node.connect(output);

	setCtxOutput(node);

	$: if (typeof frequency === 'number' && frequency !== options.frequency) {
		node.frequency.setValueAtTime(frequency, 0);
		options.frequency = frequency;
	}

	$: if (typeof Q === 'number' && Q !== options.Q) {
		node.Q.setValueAtTime(Q, 0);
		options.Q = Q;
	}

	onDestroy(() => node.disconnect(output));
</script>

<slot />
