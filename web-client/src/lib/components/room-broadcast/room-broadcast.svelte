<script lang="ts">
	import { RTCClient } from '$lib/classes/rtc-client';
	import { cn } from '$lib/utils/cn';
	import { roomClients, roomRemoteStreams, roomStream } from '../../../store/room-store';
	import RoomBroadcastVideo from './room-broadcast-video.svelte';

	let clients: Record<number, RTCClient> = $state({});
	let streams: Record<number, MediaStream> = $state({});
	let localStream: MediaStream | null = $state(null);

	roomClients.subscribe((rcs) => (clients = rcs));
	roomRemoteStreams.subscribe((strs) => (streams = strs));
	roomStream.subscribe((stream) => (localStream = stream));
</script>

<div class="relative flex flex-1 flex-col gap-2 p-4">
	<div class="w-full flex-1 overflow-auto rounded-xl border p-2">
		{#if !Object.keys(streams).length}
			<div>No users in room</div>
		{:else}
			<div class="grid grid-cols-2 gap-2">
				{#each Object.entries(streams) as [id, stream]}
					<RoomBroadcastVideo
						{stream}
						label={`User ID: ${id}`}
						containerClassName="w-full aspect-video"
					/>
				{/each}
			</div>
		{/if}
	</div>

	<div class="flex-none">
		{#if !!localStream}
			<RoomBroadcastVideo containerClassName="h-32 w-52" stream={localStream} label="You" />
		{/if}
	</div>
</div>
