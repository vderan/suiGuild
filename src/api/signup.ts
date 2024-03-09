import httpClient from './http-client';

export const xmppSignUp = (data: { username: string; wallet: string }) => {
	return httpClient({
		method: 'post',
		url: '/users',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
