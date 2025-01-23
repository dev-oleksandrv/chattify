<script lang="ts">
	import type { Snippet } from 'svelte';

	interface DialogProps {
		children: Snippet;
		dismiss: () => void;
	}

	let { children, dismiss }: DialogProps = $props();
</script>

<div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
	<div
		class="absolute left-0 top-0 z-0 h-full w-full bg-black opacity-30"
		onclick={dismiss}
		role="button"
		tabindex="-1"
	></div>

	<div class="z-10 w-[420px] rounded-lg border bg-white p-6">
		{@render children?.()}
	</div>
</div>
