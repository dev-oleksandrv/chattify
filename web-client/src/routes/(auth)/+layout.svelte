<script lang="ts">
	let { children } = $props();
</script>

<nav class="flex items-center border-b px-4 py-4">
	<p class="text-brand text-xl font-bold">Chattify</p>
</nav>

<main class="flex w-full flex-1 items-center justify-center">
	{@render children()}
</main>
