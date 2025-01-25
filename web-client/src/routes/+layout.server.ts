import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('at');
	const data = { user: null };
	const isAuthPage = url.pathname.startsWith('/register') || url.pathname.startsWith('/login');

	if (!token) {
		if (!isAuthPage) {
			redirect(303, '/register');
		}
		return data;
	}

	try {
		const result = await fetch(`${import.meta.env.VITE_API_URL!}/api/auth/verify`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});

		data.user = await result.json();
	} catch (error) {
		!isAuthPage && redirect(303, '/register');
		return data;
	}

	if (isAuthPage) {
		redirect(303, '/');
		return data;
	}

	return data;
};
