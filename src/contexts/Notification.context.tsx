import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';
import { useSocketEvent } from 'use-socket-io-react';
import { INotification } from './types';
import { api } from 'src/api';
import { AuthContext } from './Auth.context';
import { sortNotificationsByDate } from 'src/helpers/sort.helpers';
import { useErrorHandler } from 'src/hooks';

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
	const { errorProcessWithoutFeedback } = useErrorHandler();

	const notificationHandler = () => {
		try {
			Promise.all([loadUserInfo(), getNotifications()]);
		} catch (e) {
			errorProcessWithoutFeedback(e);
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
				errorProcessWithoutFeedback(e);
			}
		};
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
