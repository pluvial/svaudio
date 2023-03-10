<script lang="ts">
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

	const node = new OscillatorNode(audioCtx, {
		detune,
		periodicWave,
		frequency,
		type,
		channelCount,
		channelCountMode,
		channelInterpretation
	});

	node.connect(output);

	node.start();
</script>

<slot />
