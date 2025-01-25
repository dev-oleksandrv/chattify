<script lang="ts">
	import { RTCClient } from '$lib/classes/rtc-client';
	import { roomClients, roomRemoteStreams } from '../../../store/room-store';
	import RoomBroadcastVideo from './room-broadcast-video.svelte';

	let clients: Record<number, RTCClient> = $state({});
	let streams: Record<number, MediaStream> = $state({});

	roomClients.subscribe((rcs) => {
		console.log(rcs, 'clients subscribe');

		clients = rcs;
	});

	roomRemoteStreams.subscribe((strs) => (streams = strs));
</script>

<div class="flex-1">
	{#each Object.entries(streams) as [id, stream]}
		<RoomBroadcastVideo id={+id} {stream} />
	{/each}

	{#each Object.entries(streams) as [id, stream]}
		<p>{id}</p>
	{/each}
</div>
