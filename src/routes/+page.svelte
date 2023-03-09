<script lang="ts">
	import AudioContext from '$lib/AudioContext.svelte';
	import Gain from '$lib/Gain.svelte';
	import Oscillator from '$lib/Oscillator.svelte';
	import BiquadFilter from '$lib/BiquadFilter.svelte';
</script>

<AudioContext>
	<Gain>
		<Gain>
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
