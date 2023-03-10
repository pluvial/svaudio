<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';

	let triggerAttackRelease: () => void;
	let triggerAttackRelease2: () => void;

	function click() {
		triggerAttackRelease();
		triggerAttackRelease2();
	}
</script>

<AudioContext on:error={({ detail: error }) => console.error(error)}>
	<button type="button" on:click={click}>Trigger attack + release</button>
	<Gain>
		<Gain gain={0} bind:triggerAttackRelease>
			<BiquadFilter>
				<Oscillator />
			</BiquadFilter>
		</Gain>
		<Gain gain={0} bind:triggerAttackRelease={triggerAttackRelease2}>
			<BiquadFilter>
				<Oscillator type="sawtooth" frequency={220} />
			</BiquadFilter>
		</Gain>
	</Gain>
</AudioContext>
