<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface ButtonProps extends HTMLButtonAttributes {
		variant?: 'primary' | 'outline';
	}

	const { variant = 'primary', children, ...props }: ButtonProps = $props();
</script>

<button
	{...props}
	class={cn(
		'flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm',
		{
			'bg-brand text-white': variant === 'primary',
			'border-gray-300 bg-white': variant === 'outline'
		},
		props.class
	)}
>
	{@render children?.()}
</button>
