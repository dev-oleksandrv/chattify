<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../ui/button.svelte';
	import RoomChat from '../room-chat/room-chat.svelte';

	let videoEl: HTMLVideoElement;
	let stream: MediaStream;

	onMount(async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

			if (videoEl) {
				videoEl.srcObject = stream;
			}
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="flex flex-1">
	<div class="flex flex-1 flex-col items-center justify-center px-4">
		<div class="flex w-full max-w-[960px] flex-col gap-6">
			<p class="text-lg font-bold">Joining into Room "test"</p>

			<div class="relative h-[420px] overflow-hidden rounded-3xl bg-gray-200">
				<video muted bind:this={videoEl} autoplay class="absolute h-full w-full object-cover">
					<track kind="captions" />
				</video>
			</div>

			<div class="flex flex-1 flex-col items-center justify-center">
				<Button class="w-full">Join Room</Button>
			</div>
		</div>
	</div>

	<RoomChat containerClassName="flex w-[320px] flex-none flex-col border-l" />
</div>
