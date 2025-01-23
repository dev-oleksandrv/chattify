<script lang="ts">
	import { setContext } from 'svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	setContext('user', () => data.user);
</script>

<div class="flex h-screen w-screen flex-col overflow-visible">
	{@render children()}
</div>
