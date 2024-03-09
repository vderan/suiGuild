import httpClient from './http-client';

export const xmppAuth = (data: { username: string; password: string }): Promise<{ token: string }> => {
	return httpClient({
		method: 'post',
		url: '/auth',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
