<script lang="ts">
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

	const node = new BiquadFilterNode(audioCtx, {
		Q,
		detune,
		frequency,
		gain,
		type,
		channelCount,
		channelCountMode,
		channelInterpretation
	});

	node.connect(output);

	setCtxOutput(node);
</script>

<slot />
