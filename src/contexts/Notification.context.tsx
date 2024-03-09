import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';
import { useSocketEvent } from 'use-socket-io-react';
import { INotification } from './types';
import { api } from 'src/api';
import { AuthContext } from './Auth.context';
import { sortNotificationsByDate } from 'src/helpers/sort.helpers';
import { toast } from 'react-toastify';
import { ErrorHandler } from 'src/helpers';

interface INotificationContext {
	notifications: INotification[];
	getNotifications: () => Promise<void>;
}

export const NotificationContext = createContext<INotificationContext>({
	notifications: [],
	getNotifications: () => Promise.resolve()
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
	const { profile, loadUserInfo } = useContext(AuthContext);
	const [notifications, setNotifications] = useState<INotification[]>([]);

	const notificationHandler = () => {
		try {
			Promise.all([loadUserInfo(), getNotifications()]);
		} catch (e) {
			toast.error((e as Error).message, { theme: 'colored' });
		}
	};

	useSocketEvent('received_friend_request', {
		handler: notificationHandler
	});

	useSocketEvent('friend_approved_request', {
		handler: notificationHandler
	});

	useSocketEvent('friend_rejected_request', {
		handler: notificationHandler
	});

	useSocketEvent('deleted_friend', {
		handler: notificationHandler
	});

	const getNotifications = useCallback(async () => {
		if (!profile?.displayName) return;
		const data = await api.getAllNotifications(profile.displayName);
		const notifications = sortNotificationsByDate(data);
		setNotifications(notifications);
	}, [profile?.displayName]);

	useEffect(() => {
		const init = async () => {
			try {
				await getNotifications();
			} catch (e) {
				ErrorHandler.processWithoutFeedback(e);
			}
		};
		init();
	}, [getNotifications]);

	return (
		<>
			<NotificationContext.Provider
				value={{
					notifications,
					getNotifications
				}}
			>
				{children}
			</NotificationContext.Provider>
		</>
	);
};
