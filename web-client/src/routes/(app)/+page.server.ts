import { fail, redirect, type Actions } from '@sveltejs/kit';
import { createRoomSchema } from '../../schemas/room-validation';

export const actions = {
	createRoom: async (event) => {
		const formData = await event.request.formData();

		const { success, error, data } = await createRoomSchema.safeParseAsync({
			title: formData.get('title')
		});

		if (!success || error || !data) {
			return fail(400, { error: true });
		}

		let redirectionUrl = '/';

		try {
			const result = await fetch(`https://${import.meta.env.VITE_API_URL!}/api/protected/room`, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${event.cookies.get('at')}`
				}
			});
			const parsed = await result.json();

			redirectionUrl = `/room/${parsed.id}`;
		} catch (error) {
			console.log(error);

			return fail(400, { error: true });
		}

		return redirect(303, redirectionUrl);
	}
} satisfies Actions;
