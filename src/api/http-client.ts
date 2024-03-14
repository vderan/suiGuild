import { XMPP_DOMAIN } from 'src/constants/xmpp.constants';
import { ApiError } from 'src/types/Api.types';

export const httpClient = async <T>({
	headers
}: {
	url: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	data?: Record<string, unknown>;
	headers?: Record<string, string>;
}): Promise<T> => {
	const path = `https://gilder-test.m.in-app.io:5281/api/create_account`;
	// const accessToken = localStorage.getItem(LOCAL_STORAGE.JWT);

	const response = await fetch(path, {
		method: 'POST',
		headers: {
			...headers,
			Authorization: `Bearer 1b776f9636c2760d930edaba5b9402a28ac8929da05fe29f449154d39be9c268`
		},
		body: JSON.stringify({
			user: 'testuser',
			password: 'myserver.com',
			server: XMPP_DOMAIN
		})
	});

	if (!response.ok) {
		const errorResponse = (await response.json()) as ApiError;
		return Promise.reject(errorResponse);
	}

	return response.json();
};

export default httpClient;
