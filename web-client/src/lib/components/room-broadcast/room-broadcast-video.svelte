<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { onMount } from 'svelte';

	interface Props {
		stream: MediaStream;
		muted?: boolean;
		containerClassName?: string;
		label?: string;
	}

	let videoEl: HTMLVideoElement;

	const { stream, muted, containerClassName, label }: Props = $props();

	onMount(() => {
		if (videoEl && stream) {
			videoEl.srcObject = stream;
		}
	});
</script>

<div class={cn('relative overflow-hidden rounded-xl', containerClassName)}>
	<video {muted} bind:this={videoEl} autoplay class="h-full w-full object-cover">
		<track kind="captions" />
	</video>

	{#if !!label}
		<div class="absolute left-2 top-2 rounded-full bg-white px-4 py-1">
			<p class="text-xs">{label}</p>
		</div>
	{/if}
</div>
