<script lang="ts">
	import { getCtx, setCtxOutput } from './context';

	type $$Props = GainOptions & { attack?: number; hold?: number; release?: number };

	export let gain: $$Props['gain'] = undefined;

	export let channelCount: $$Props['channelCount'] = undefined;
	export let channelCountMode: $$Props['channelCountMode'] = undefined;
	export let channelInterpretation: $$Props['channelInterpretation'] = undefined;

	export let attack: number = 0.01;
	export let hold: number = 0.2;
	export let release: number = 0.1;

	const { audioCtx, output } = getCtx();

	const node = new GainNode(audioCtx, {
		gain,
		channelCount,
		channelCountMode,
		channelInterpretation
	});

	node.connect(output);

	setCtxOutput(node);

	export const triggerAttackRelease = (time = audioCtx.currentTime) => {
		const param = node.gain;
		param.cancelScheduledValues(time);
		param.setValueAtTime(0, time);
		param.linearRampToValueAtTime(1, time + attack);
		param.setValueAtTime(1, time + attack + hold);
		param.linearRampToValueAtTime(0, time + attack + hold + release);
	};
</script>

<slot />
