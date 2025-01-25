export const load = async (event) => {
	let token = '';

	try {
		const result = await fetch(`${import.meta.env.VITE_API_URL!}/api/protected/ws/handshake`, {
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
