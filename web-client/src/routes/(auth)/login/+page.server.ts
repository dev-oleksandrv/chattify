import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { loginUserSchema } from '../../../schemas/user-validation';
import { PUBLIC_API_URL } from '$env/static/public';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const { success, error, data } = await loginUserSchema.safeParseAsync({
			email: formData.get('email'),
			password: formData.get('password')
		});

		if (!success || error || !data) {
			return fail(400, { error: true });
		}

		try {
			const result = await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: { 'Content-Type': 'application/json' }
			});
			const parsed = await result.json();

			event.cookies.set('at', parsed.token, { path: '/' });
		} catch (error) {
			console.log(error);

			return fail(400, { error: true });
		}

		return redirect(303, '/');
	}
} satisfies Actions;
