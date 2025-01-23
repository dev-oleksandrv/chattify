<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import InputContainer from '$lib/components/ui/input-container.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';

	let isModal = $state(false);

	function toggleModal() {
		isModal = !isModal;
	}
</script>

<div class="w-full space-y-8 p-4">
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Recently Visited</p>

			<Button onclick={toggleModal}>Create Room</Button>
		</div>

		<p class="text-sm text-gray-700">No recently visited rooms</p>
	</div>

	<div class="space-y-4">
		<p class="text-2xl font-bold">Online Rooms</p>

		<p class="text-sm text-gray-700">No online rooms for now</p>
	</div>
</div>

{#if isModal}
	<Dialog dismiss={toggleModal}>
		<div class="space-y-2">
			<p class="text-lg font-bold">Create Room</p>

			<form action="?/createRoom" method="POST" use:enhance class="space-y-4">
				<InputContainer>
					<Label for="title">Room Title</Label>
					<Input name="title" id="title" type="text" placeholder="Talk with friends" />
				</InputContainer>

				<Button type="submit" class="w-full">Create Room</Button>
			</form>
		</div>
	</Dialog>
{/if}
