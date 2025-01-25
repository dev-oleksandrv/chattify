import { PUBLIC_API_URL } from '$env/static/public';

export const load = async (event) => {
	let token = '';

	try {
		const result = await fetch(`${PUBLIC_API_URL}/api/protected/ws/handshake`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${event.cookies.get('at')}`,
				'X-Room-Id': event.params.id
			}
		});
		const parsed = await result.json();

		token = parsed.token;
	} catch (error) {}

	return { token };
};
