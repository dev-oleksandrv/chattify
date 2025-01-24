<script lang="ts">
	import { page } from '$app/state';
	import RoomBroadcast from '$lib/components/room-broadcast/room-broadcast.svelte';
	import RoomLobby from '$lib/components/room-lobby/room-lobby.svelte';
	import { wsManager } from '$lib/ws/websocket';
	import { onMount } from 'svelte';

	const { token } = page.data;

	let isLobby = $state(true);

	onMount(() => {
		const wsUrl = `ws://localhost:8000/ws?token=${token}`;

		wsManager.connect(wsUrl);

		return () => {
			wsManager.close();
		};
	});
</script>

{#if isLobby}
	<RoomLobby />
{:else}
	<RoomBroadcast />
{/if}
