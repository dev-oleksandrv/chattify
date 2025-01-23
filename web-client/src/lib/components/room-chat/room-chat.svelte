<script lang="ts">
	import Input from '../ui/input.svelte';

	interface RoomChatProps {
		containerClassName?: string;
	}

	let { containerClassName }: RoomChatProps = $props();
</script>

<div class={containerClassName}>
	<div class="flex-1">
		<!-- messages here -->
	</div>

	<div class="border-t px-4 py-2">
		<form>
			<Input type="text" class="w-full" />
			<p class="text-xs text-gray-300">Press 'Enter' to send</p>
		</form>
	</div>
</div>
