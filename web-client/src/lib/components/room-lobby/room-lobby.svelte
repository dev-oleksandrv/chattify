<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../ui/button.svelte';
	import { roomStatus, updateRoomStream } from '../../../store/room-store';
	import { RoomStatus } from '../../../types/room-types';
	import { joinBroadcastAction } from '$lib/ws/websocket-actions';

	let videoEl: HTMLVideoElement;
	let status: RoomStatus = $state(RoomStatus.Lobby);

	roomStatus.subscribe((st) => (status = st));

	const handleJoinVideoRoom = () => {
		joinBroadcastAction();
	};

	onMount(async () => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

			updateRoomStream(localStream);

			if (videoEl) {
				videoEl.srcObject = localStream;
			}
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="flex flex-1 flex-col items-center justify-center px-4">
	<div class="flex w-full max-w-[960px] flex-col gap-6">
		<p class="text-lg font-bold">Joining into Room "test"</p>

		<div class="relative h-[420px] overflow-hidden rounded-3xl bg-gray-200">
			<video muted bind:this={videoEl} autoplay class="absolute h-full w-full object-cover">
				<track kind="captions" />
			</video>
		</div>

		<div class="flex flex-1 flex-col items-center justify-center">
			<Button class="w-full" disabled={status !== RoomStatus.Lobby} onclick={handleJoinVideoRoom}>
				Join Video Room
			</Button>
		</div>
	</div>
</div>
