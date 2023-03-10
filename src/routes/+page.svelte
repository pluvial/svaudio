<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let volume = 1;

	let active = [true, true];
	let waveforms: OscillatorType[] = ['sawtooth', 'sawtooth'];
	let volumes = [1, 1];

	let frequency = 330;
	let detune = 1;

	let filterFrequency = 2000;
	let filterResonance = 1;

	let triggerAttack: () => void;
	let triggerRelease: () => void;
	let triggerAttackRelease: () => void;

	let pressedCodes = new Set<string>();

	function keydown(event: KeyboardEvent) {
		const { code, key, altKey, ctrlKey, metaKey, shiftKey } = event;
		if (altKey || ctrlKey || metaKey || shiftKey) return;
		if (!pressedCodes.has(code)) {
			pressedCodes.add(code);
			triggerAttack();
		}
	}

	function keyup(event: KeyboardEvent) {
		const { code, key, altKey, ctrlKey, metaKey, shiftKey } = event;
		if (pressedCodes.has(code)) {
			pressedCodes.delete(code);
			triggerRelease();
		}
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<p slot="suspended">click to activate audio context</p>

	<p slot="closed">audio context closed</p>

	<Gain gain={volume}>
		<Gain gain={0} bind:triggerAttack bind:triggerRelease bind:triggerAttackRelease>
			<BiquadFilter frequency={filterFrequency} Q={filterResonance}>
				{#if active[0]}
					<Gain gain={volumes[0]}>
						<Oscillator {frequency} type={waveforms[0]} />
					</Gain>
				{/if}
				{#if active[1]}
					<Gain gain={volumes[1]}>
						<Oscillator {detune} {frequency} type={waveforms[1]} />
					</Gain>
				{/if}
			</BiquadFilter>
		</Gain>
	</Gain>

	<main>
		<section>
			<h2>Master</h2>

			<label>
				Volume
				<input type="range" min={0} max={1} step={0.01} bind:value={volume} />
			</label>
		</section>

		<section>
			<h2>Oscillator 1</h2>

			<label>
				Active
				<input type="checkbox" bind:checked={active[0]} />
			</label>

			<label>
				Waveform
				<select bind:value={waveforms[0]} disabled={!active[0]}
					><option>sine</option>
					<option>triangle</option>
					<option>square</option>
					<option>sawtooth</option>
				</select>
			</label>

			<label>
				Volume
				<input
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={volumes[0]}
					disabled={!active[0]}
				/>
			</label>

			<label>
				Frequency
				<input type="range" min={20} max={1000} step={0.1} bind:value={frequency} />
			</label>
		</section>

		<section>
			<h2>Oscillator 2</h2>

			<label>
				Active
				<input type="checkbox" bind:checked={active[1]} />
			</label>

			<label>
				Waveform
				<select bind:value={waveforms[1]} disabled={!active[1]}
					><option>sine</option>
					<option>triangle</option>
					<option>square</option>
					<option>sawtooth</option>
				</select>
			</label>

			<label>
				Detune
				<input type="range" min={-50} max={50} step={0.1} bind:value={detune} />
			</label>
		</section>

		<section>
			<h2>Filter</h2>

			<label>
				Frequency
				<input type="range" min={30} max={10000} step={0.1} bind:value={filterFrequency} />
			</label>

			<label>
				Resonance
				<input type="range" min={0} max={50} step={0.1} bind:value={filterResonance} />
			</label>
		</section>

		<section>
			<h2>Triggers</h2>

			<button type="button" on:click={() => triggerAttack()}>Attack</button>

			<button type="button" on:click={() => triggerRelease()}>Release</button>

			<button type="button" on:click={() => triggerAttackRelease()}>Attack + Release</button>
		</section>
	</main>
</AudioContext>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	h2 {
		margin-top: 1em;
		margin-bottom: 0.2em;
	}

	label {
		max-width: 20em;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5em;
	}
</style>
