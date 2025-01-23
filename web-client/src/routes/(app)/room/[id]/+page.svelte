<script>
	import RoomBroadcast from '$lib/components/room-broadcast/room-broadcast.svelte';
	import RoomLobby from '$lib/components/room-lobby/room-lobby.svelte';

	let isLobby = $state(true);
</script>

{#if isLobby}
	<RoomLobby />
{:else}
	<RoomBroadcast />
{/if}
