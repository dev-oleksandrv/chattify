<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id: number;
		stream: MediaStream;
	}

	let videoEl: HTMLVideoElement;

	const { id, stream }: Props = $props();

	onMount(() => {
		if (videoEl && stream) {
			videoEl.srcObject = stream;
		}
	});
</script>

<div>
	<video muted bind:this={videoEl} autoplay class="h-[200px] w-[200px]">
		<track kind="captions" />
	</video>
</div>
