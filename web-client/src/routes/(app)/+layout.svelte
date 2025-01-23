<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';

	let { children } = $props();
</script>

<nav class="flex items-center justify-between border-b px-4 py-2">
	<p class="text-brand text-xl font-bold">Chattify</p>

	<a href="/logout"> <Button variant="outline">Logout</Button></a>
</nav>

<main class="flex w-full flex-1 overflow-auto">
	{@render children()}
</main>
