<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let { children, ...props }: HTMLLabelAttributes = $props();
</script>

<label {...props} class={cn('text-sm text-gray-600', props.class)}>
	{@render children?.()}
</label>
