<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let volume = 1;

	let filterFrequency = 2000;
	let filterResonance = 1;
	let filterType: BiquadFilterType = 'lowpass';

	const filterTypes: BiquadFilterType[] = [
		'allpass',
		'bandpass',
		'highpass',
		'highshelf',
		'lowpass',
		'lowshelf',
		'notch',
		'peaking'
	];

	let frequency = 220;

	const oscillatorTypes: OscillatorType[] = ['sine', 'triangle', 'square', 'sawtooth'];

	let active = [true, true, true];
	let waveforms: OscillatorType[] = ['sawtooth', 'sawtooth', 'sawtooth'];
	let volumes = [1, 1, 1];
	let detunes = [0, 20, 30];
	let frequencies = [frequency, frequency, frequency];
	let follow = [true, true, true];

	let triggerAttack: () => void;
	let triggerRelease: () => void;
	let triggerAttackRelease: () => void;

	let pressedCodes = new Set<string>();

	function keydown(event: KeyboardEvent) {
		const { code, key, altKey, ctrlKey, metaKey, shiftKey } = event;
		if (altKey || ctrlKey || metaKey || shiftKey) return;
		if (!pressedCodes.has(code)) {
			pressedCodes.add(code);
			triggerAttack?.();
		}
	}

	function keyup(event: KeyboardEvent) {
		const { code, key, altKey, ctrlKey, metaKey, shiftKey } = event;
		if (pressedCodes.has(code)) {
			pressedCodes.delete(code);
			triggerRelease?.();
		}
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<p slot="suspended">interact to activate audio context</p>

	<p slot="closed">audio context closed</p>

	<Gain gain={volume}>
		<Gain gain={0} bind:triggerAttack bind:triggerRelease bind:triggerAttackRelease>
			<BiquadFilter frequency={filterFrequency} Q={filterResonance} type={filterType}>
				{#each { length: 3 } as _, o}
					{#if active[o]}
						<Gain gain={volumes[o]}>
							<Oscillator
								frequency={follow[o] ? frequency : frequencies[o]}
								type={waveforms[o]}
								detune={o === 0 ? undefined : detunes[o]}
							/>
						</Gain>
					{/if}
				{/each}
			</BiquadFilter>
		</Gain>
	</Gain>
</AudioContext>

<main>
	<section>
		<h2>Triggers</h2>

		<button type="button" on:click={() => triggerAttack()}>Attack</button>

		<button type="button" on:click={() => triggerRelease()}>Release</button>

		<button type="button" on:click={() => triggerAttackRelease()}>Attack + Release</button>
	</section>

	<section>
		<h2>Master</h2>

		<label>
			Volume
			<input type="range" min={0} max={1} step={0.01} bind:value={volume} />
		</label>
	</section>

	<section>
		<h2>Filter</h2>

		<label>
			Type
			<select bind:value={filterType}
				>{#each filterTypes as type}<option>{type}</option>{/each}
			</select>
		</label>

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
		<h2>Oscillators</h2>

		<label>
			Frequency
			<input type="range" min={20} max={2000} step={0.1} bind:value={frequency} />
		</label>

		{#each { length: 3 } as _, o}
			<h3>Oscillator {o + 1}</h3>

			<label>
				Active
				<input type="checkbox" bind:checked={active[o]} />
			</label>

			<label>
				Volume
				<input
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={volumes[o]}
					disabled={!active[o]}
				/>
			</label>

			<label>
				Waveform
				<select bind:value={waveforms[o]} disabled={!active[o]}
					>{#each oscillatorTypes as type}<option>{type}</option>{/each}
				</select>
			</label>

			<label>
				Follow
				<input type="checkbox" bind:checked={follow[o]} disabled={!active[o]} />
			</label>

			<label>
				Frequency
				<input
					type="range"
					min={20}
					max={2000}
					step={0.1}
					bind:value={frequencies[o]}
					disabled={!active[o] || follow[o]}
				/>
			</label>

			<label>
				Detune
				<input
					type="range"
					min={-50}
					max={50}
					step={0.1}
					bind:value={detunes[o]}
					disabled={!active[o]}
				/>
			</label>
		{/each}
	</section>
</main>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	h2 {
		margin-top: 0.5em;
		margin-bottom: 0.2em;
	}

	h3 {
		margin-top: 0.5em;
		margin-bottom: 0.2em;
	}

	label {
		max-width: 40em;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5em;
	}

	input[type='range'] {
		width: 40em;
	}
</style>
