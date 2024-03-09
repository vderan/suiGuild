import notificationAudio from 'src/assets/notification.mp3';
import { NotificationSetting } from 'src/types/Xmpp.types';

export const requestNotificationPermission = async () => {
	if ('Notification' in window) {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			return true;
		}
	}

	return false;
};

export const showNotification = async (title: string, msg: string) => {
	if ('Notification' in window) {
		if (Notification.permission === 'granted') {
			return callNotify(title, msg);
		}

		if (Notification.permission !== 'denied') {
			const permission = await Notification.requestPermission();
			if (permission === 'granted') {
				return callNotify(title, msg);
			}
		}
	}

	return;
};

const callNotify = (title: string, msg: string) => {
	const notification = new Notification(title, {
		body: msg,
		icon: 'https://pbs.twimg.com/profile_images/1638264845685358593/435BRvwH_400x400.jpg'
	});
	const audio = new Audio(notificationAudio);
	audio.play();

	return notification;
};

export const isNotificationsEnabled = (roomJid: string, notificationSettings: NotificationSetting[]) => {
	const notificationSetting = notificationSettings.find(ns => ns.roomJid === roomJid);

	if (typeof notificationSetting === 'undefined') {
		return true;
	}

	return notificationSetting.enabled;
};
