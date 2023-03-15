<script lang="ts">
	import { getCtx } from './context';

	export let param: string;

	export let attack = 0.01;
	export let hold = 0.2;
	export let release = 0.1;

	const { audioCtx, output } = getCtx();

	export let triggerAttack = (time = audioCtx.currentTime) => {
		const audioParam = output[param as keyof AudioNode] as unknown as AudioParam;
		audioParam.cancelScheduledValues(time);
		audioParam.setValueAtTime(0, time);
		audioParam.linearRampToValueAtTime(1, time + attack);
	};

	export let triggerRelease = (time = audioCtx.currentTime) => {
		const audioParam = output[param as keyof AudioNode] as unknown as AudioParam;
		audioParam.cancelScheduledValues(time + release);
		audioParam.linearRampToValueAtTime(0, time + release);
	};

	export let triggerAttackRelease = (time = audioCtx.currentTime) => {
		triggerAttack(time);
		triggerRelease(time + attack + hold);
	};
</script>

<slot {triggerAttack} {triggerRelease} {triggerAttackRelease} />
