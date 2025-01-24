<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), ...props }: HTMLInputAttributes = $props();
</script>

<input
	{...props}
	bind:value
	class={cn('rounded-lg border px-2 py-2 text-sm outline-none', props.class)}
/>
