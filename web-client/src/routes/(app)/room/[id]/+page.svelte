<script lang="ts">
	import { page } from '$app/state';
	import RoomBroadcast from '$lib/components/room-broadcast/room-broadcast.svelte';
	import RoomLobby from '$lib/components/room-lobby/room-lobby.svelte';
	import { wsManager } from '$lib/ws/websocket';
	import { onMount } from 'svelte';
	import { roomStatus } from '../../../../store/room-store';
	import { RoomStatus } from '../../../../types/room-types';
	import RoomChat from '$lib/components/room-chat/room-chat.svelte';

	const { token } = page.data;

	let isLobby = $state(true);
	let status = $state(RoomStatus.Lobby);

	roomStatus.subscribe((state) => (status = state));

	onMount(() => {
		const wsUrl = `ws://${import.meta.env.VITE_API_URL}/ws?token=${token}`;
		wsManager.connect(wsUrl);

		return () => {
			wsManager.close();
		};
	});
</script>

<div class="flex flex-1">
	{#if status === RoomStatus.Broadcast}
		<RoomBroadcast />
	{:else}
		<RoomLobby />
	{/if}

	<RoomChat containerClassName="flex w-[320px] flex-none flex-col border-l" />
</div>
