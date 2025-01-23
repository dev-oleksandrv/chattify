<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import InputContainer from '$lib/components/ui/input-container.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
</script>

<div class="w-full max-w-[420px] space-y-8 rounded-xl border p-4">
	<div class="text-center">
		<p class="text-xl font-semibold">Join <span class="text-brand">Chattify</span> Now!</p>

		<p class="text-sm text-gray-700">Register into the application to use all the features.</p>
	</div>

	<form method="POST" class="space-y-4" use:enhance>
		<InputContainer>
			<Label for="email">E-Mail</Label>
			<Input id="email" name="email" type="email" placeholder="example@mail.com" />
		</InputContainer>

		<InputContainer>
			<Label for="username">Username</Label>
			<Input id="username" name="username" type="text" placeholder="johndoe" />
		</InputContainer>

		<InputContainer>
			<Label for="password">Password</Label>
			<Input id="password" name="password" type="password" />
		</InputContainer>

		<InputContainer>
			<Label for="confirmPassword">Confirm Password</Label>
			<Input id="confirmPassword" name="confirmPassword" type="password" />
		</InputContainer>

		<div>
			<Button type="submit" class="w-full">Sign Up</Button>
		</div>
	</form>
</div>
