import axios from 'axios';
import { NOTIFICATION_URL } from 'src/constants/api.constants';
import { INotification } from 'src/contexts';

export const getAllNotifications = async (user: string) => {
	if (!user) return [];

	const response = await axios.post(`${NOTIFICATION_URL}/get-unreads`, { user: user });
	return response.data.data as INotification[];
};

export const markAsRead = async (_id: string) => {
	await axios.post(`${NOTIFICATION_URL}/mark-as-read`, { notificationId: _id });
};

export const markAllAsRead = async (user: string) => {
	await axios.post(`${NOTIFICATION_URL}/mark-all-read`, { user: user });
};
