<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let triggerAttackRelease: () => void;

	function click() {
		triggerAttackRelease();
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<button type="button" on:click={click}>Trigger attack + release</button>
	<Gain gain={1}>
		<Gain bind:triggerAttackRelease>
			<BiquadFilter>
				<Oscillator />
			</BiquadFilter>
		</Gain>
		<Gain>
			<BiquadFilter>
				<Oscillator />
			</BiquadFilter>
		</Gain>
	</Gain>
</AudioContext>
