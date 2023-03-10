<script lang="ts">
	import { getCtx, validate } from './context';

	validate();

	const ctx = getCtx();
</script>

<slot />
