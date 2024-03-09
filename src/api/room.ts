import httpClient from './http-client';

export const leaveRoom = (data: { roomJid: string; memberJid: string }) => {
	return httpClient({
		method: 'post',
		url: '/members/leave',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
