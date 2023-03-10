<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getCtx, setCtxOutput } from './context';

	interface TriggerFns {
		triggerAttack?: (when?: number) => void;
		triggerRelease?: (when?: number) => void;
		triggerAttackRelease?: (when?: number) => void;
	}

	type $$Props = GainOptions &
		TriggerFns & {
			attack?: number;
			hold?: number;
			release?: number;
		};

	export let gain: $$Props['gain'] = undefined;

	export let channelCount: $$Props['channelCount'] = undefined;
	export let channelCountMode: $$Props['channelCountMode'] = undefined;
	export let channelInterpretation: $$Props['channelInterpretation'] = undefined;

	export let attack: number = 0.01;
	export let hold: number = 0.2;
	export let release: number = 0.1;

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

	export let triggerAttack = (time = audioCtx.currentTime) => {
		const param = node.gain;
		param.cancelScheduledValues(time);
		param.setValueAtTime(0, time);
		param.linearRampToValueAtTime(1, time + attack);
	};

	export let triggerRelease = (time = audioCtx.currentTime) => {
		const param = node.gain;
		param.cancelScheduledValues(time + release);
		param.linearRampToValueAtTime(0, time + release);
	};

	export let triggerAttackRelease = (time = audioCtx.currentTime) => {
		triggerAttack(time);
		triggerRelease(time + attack + hold);
	};

	$: if (typeof gain === 'number' && gain !== options.gain) {
		node.gain.setValueAtTime(gain, 0);
		options.gain = gain;
	}

	onDestroy(() => node.disconnect(output));
</script>

<slot {triggerAttack} {triggerRelease} {triggerAttackRelease} />
