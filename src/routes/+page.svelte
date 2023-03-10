<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let active = [true, true];

	let volume = 1;
	let detune = 1;
	let frequency = 330;
	let filterFrequency = 2000;
	let filterResonance = 1;

	let triggerAttackRelease: () => void;

	function trigger() {
		triggerAttackRelease?.();
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<Gain gain={volume}>
		<Gain gain={0} bind:triggerAttackRelease>
			<BiquadFilter frequency={filterFrequency} Q={filterResonance}>
				{#if active[0]}
					<Oscillator type="sawtooth" {frequency} />
				{/if}
				{#if active[1]}
					<Oscillator type="sawtooth" {detune} {frequency} />
				{/if}
			</BiquadFilter>
		</Gain>
	</Gain>

	<label>
		Volume
		<input type="range" min={0} max={1} step={0.01} bind:value={volume} />
	</label>

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
		<input type="range" min={-50} max={50} step={0.1} bind:value={detune} />
	</label>

	<label>
		Frequency
		<input type="range" min={30} max={1000} step={0.1} bind:value={frequency} />
	</label>

	<label>
		Filter frequency
		<input type="range" min={30} max={10000} step={0.1} bind:value={filterFrequency} />
	</label>

	<label>
		Filter resonance
		<input type="range" min={0} max={50} step={0.1} bind:value={filterResonance} />
	</label>

	<button type="button" on:click={trigger}>Trigger attack + release</button>
</AudioContext>

<svelte:window on:keydown={(event) => !event.ctrlKey && !event.metaKey && trigger()} />
