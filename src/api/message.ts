import axios from 'axios';
import { MESSAGE_URL } from 'src/constants/api.constants';

export const getUnreadCounts = async (user: string, group: string) => {
	const response = await axios.post(`${MESSAGE_URL}/get-count`, { to: user, group: group });
	return response.data;
};

export const markAsReadMessage = async (user: string, group: string) => {
	await axios.post(`${MESSAGE_URL}/init`, { to: user, group: group });
};

export const markAsUnreadMessage = async (users: string, group: string) => {
	await axios.post(`${MESSAGE_URL}/new-message`, { to: users, group: group });
};
