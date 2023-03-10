<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let active = [true, true];

	let detune = 1;
	let frequency = 330;

	let triggerAttackRelease: () => void;
	let triggerAttackRelease2: () => void;

	function trigger() {
		active[0] && triggerAttackRelease();
		active[1] && triggerAttackRelease2();
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<Gain>
		{#if active[0]}
			<Gain gain={0} bind:triggerAttackRelease>
				<BiquadFilter>
					<Oscillator type="sawtooth" {frequency} />
				</BiquadFilter>
			</Gain>
		{/if}
		{#if active[1]}
			<Gain gain={0} bind:triggerAttackRelease={triggerAttackRelease2}>
				<BiquadFilter>
					<Oscillator type="sawtooth" {detune} {frequency} />
				</BiquadFilter>
			</Gain>
		{/if}
	</Gain>

	<label>
		Oscillator 1 active
		<input type="checkbox" bind:checked={active[0]} />
	</label>

	<label>
		Oscillator 2 active
		<input type="checkbox" bind:checked={active[1]} />
	</label>

	<label>
		Detune
		<input type="range" min={-50} max={50} step={0.01} bind:value={detune} />
	</label>

	<label>
		Frequency
		<input type="range" min={30} max={1000} step={1} bind:value={frequency} />
	</label>

	<button type="button" on:click={trigger}>Trigger attack + release</button>
</AudioContext>

<svelte:window on:keydown={(event) => !event.ctrlKey && !event.metaKey && trigger()} />
