import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registerUserSchema } from '../../../schemas/user-validation';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const { success, error, data } = await registerUserSchema.safeParseAsync({
			email: formData.get('email'),
			username: formData.get('username'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword')
		});

		if (!success || error || !data) {
			return fail(400, { error: true, details: error });
		}

		const { confirmPassword: _, ...dto } = data;

		try {
			const result = await fetch('http://localhost:8000/api/auth/register', {
				method: 'POST',
				body: JSON.stringify(dto),
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
