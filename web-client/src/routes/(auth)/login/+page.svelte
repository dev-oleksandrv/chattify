<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button.svelte';
	import InputContainer from '$lib/components/ui/input-container.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
</script>

<div class="w-full max-w-[420px] space-y-4 rounded-xl border p-4 py-6">
	<div class="text-center">
		<p class="text-xl font-semibold">Sign In into <span class="text-brand">Chattify</span></p>

		<p class="text-sm text-gray-700">Confirm your user to continue using Chattify features.</p>
	</div>

	<form method="POST" class="space-y-4" use:enhance>
		<InputContainer>
			<Label for="email">E-Mail</Label>
			<Input id="email" name="email" type="email" placeholder="example@mail.com" />
		</InputContainer>

		<InputContainer>
			<Label for="password">Password</Label>
			<Input id="password" name="password" type="password" />
		</InputContainer>

		<div>
			<Button type="submit" class="w-full">Sign In</Button>
		</div>
	</form>

	<p class="text-center text-sm text-gray-500">
		Don't have an account? <a href="/register" class="text-brand">Sign Up</a>
	</p>
</div>
