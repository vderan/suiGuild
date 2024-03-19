import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from 'src/constants/constants';
import { XMPP_API_URL } from 'src/constants/env.constants';

export const xmppHttpClient = async <T>({
	url,
	method,
	data,
	headers = {}
}: {
	url: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	data?: Record<string, unknown>;
	headers?: Record<string, string>;
}): Promise<T> => {
	const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.JWT);

	const response = await axios({
		url: `${XMPP_API_URL}${url}`,
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			...headers
		},
		...(data ? { body: JSON.stringify(data) } : {})
	});

	return response.data;
};

export const xmppAuth = (data: { username: string; password: string }): Promise<{ token: string }> => {
	return xmppHttpClient({
		method: 'post',
		url: '/auth',
		data
	});
};

export const leaveRoom = (data: { roomJid: string; memberJid: string }) => {
	return xmppHttpClient({
		method: 'post',
		url: '/members/leave',
		data
	});
};

export const xmppSignUp = (data: { username: string; wallet: string }) => {
	return xmppHttpClient({
		method: 'post',
		url: '/users',
		data
	});
};
