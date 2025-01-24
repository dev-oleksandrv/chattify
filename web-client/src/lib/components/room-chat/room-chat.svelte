<script lang="ts">
	import { wsManager } from '$lib/ws/websocket';
	import { sendMessageAction } from '$lib/ws/websocket-actions';
	import { WsEventType } from '$lib/ws/websocket-events';
	import { roomMessages } from '../../../store/room-store';
	import { RoomMessageType, type RoomMessage } from '../../../types/room-types';
	import Input from '../ui/input.svelte';

	interface RoomChatProps {
		containerClassName?: string;
	}

	let { containerClassName }: RoomChatProps = $props();

	let messages: RoomMessage[] = $state([]);
	let inputValue = $state('');

	roomMessages.subscribe((val) => (messages = val));

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		if (!inputValue) {
			return;
		}

		sendMessageAction(wsManager, {
			type: WsEventType.SendMessage,
			content: inputValue
		});

		inputValue = '';
	};
</script>

<div class={containerClassName}>
	<div class="flex flex-1 flex-col justify-end gap-2 overflow-auto px-4 py-2">
		{#each messages as msg}
			{#if msg.type === RoomMessageType.System}
				<p class="text-xs text-gray-500">{msg.content}</p>
			{:else if msg.type === RoomMessageType.User}
				<div class="rounded-xl border p-2">
					<p class="text-sm">{msg.content}</p>
				</div>
			{/if}
		{/each}
	</div>

	<div class="border-t px-4 py-2">
		<form onsubmit={handleSubmit}>
			<Input type="text" class="w-full" bind:value={inputValue} />
			<p class="text-xs text-gray-300">Press 'Enter' to send</p>
		</form>
	</div>
</div>
