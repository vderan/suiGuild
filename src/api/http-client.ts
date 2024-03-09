import { BASE_URL, LOCAL_STORAGE } from 'src/constants/api.constants';
import { ApiError } from 'src/types/Api.types';

export const httpClient = async <T>({
	url,
	method,
	data,
	headers
}: {
	url: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	data?: Record<string, unknown>;
	headers?: Record<string, string>;
}): Promise<T> => {
	const path = `${BASE_URL}${url}`;
	const accessToken = localStorage.getItem(LOCAL_STORAGE.JWT);

	const response = await fetch(path, {
		method,
		headers: {
			...headers,
			Authorization: `Bearer ${accessToken}`
		},
		...(data ? { body: JSON.stringify(data) } : {})
	});

	if (!response.ok) {
		const errorResponse = (await response.json()) as ApiError;
		return Promise.reject(errorResponse);
	}

	return response.json();
};

export default httpClient;
