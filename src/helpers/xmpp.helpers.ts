import { JID } from '@xmpp/jid';
import { format, isToday } from 'date-fns';
import emojiRegex from 'emoji-regex';
import { NEW_MEMBER_JOINED, REVOKED_MEMBERSHIP, XMPP_DOMAIN } from 'src/constants/xmpp.constants';
import { Message } from 'src/types/Xmpp.types';

export const getUsernameFromJid = (jid: string | JID) => {
	return jid.toString().split('@')[0];
};

export const getNickname = (jid: string | JID) => {
	return jid.toString().split('@')[0];
};

export const getRoomName = (jid: string | JID) => {
	return jid.toString().split('@')[0];
};

export const getMessageTimestamp = (dateInput: Date) => {
	if (isToday(dateInput)) {
		// If the date is today, return the current timestamp
		return format(dateInput, 'HH:mm');
	} else {
		// If the date is not today, return the date and timestamp
		return format(dateInput, 'dd MMM yyyy, HH:mm');
	}
};

/**
 * Converts a JID to a bare JID (i.e., removes the resource)
 *
 * @param user The JID to convert
 * @returns `user@xmpp.com`
 */
export const toBareJid = (user: string) => {
	return `${user}@${XMPP_DOMAIN}`;
};

export const removeResourceFromJid = (jid: string) => {
	return jid.toString().split('/')[0];
};

export const isOnlyEmoji = (message: Message) => {
	if (message.message.trim() === '') {
		return false;
	}

	const strippedString = message.message.replace(emojiRegex(), '');

	// check if stripped string is empty (i.e., string only contained emoji)
	return strippedString.trim() === '';
};

export const enlargeEmoji = (message: Message) => {
	return message.message.replace(emojiRegex(), '<span class="large-emoji">$&</span>');
};

export const isGifUrl = async (message: Message) => {
	try {
		const response = await fetch(message.message, { method: 'HEAD' });
		return response.headers.get('Content-Type') === 'image/gif';
	} catch (error) {
		return false;
	}
};

export const replaceURLsWithAnchors = (message: string) => {
	const urlPattern = /(https?:\/\/[^\s]+)/gi;
	return message.replace(urlPattern, '<a href="$&" style="color: yellow;" rel="noopener" target="_blank">$&</a>');
};

export const highlightMessage = (search: string, message: string) => {
	if (!search.trim()) {
		// if keyword is empty or just spaces, return the original string
		return message;
	}

	// Create a regular expression from the keyword
	// The 'gi' flags mean: g = global (find all matches), i = case-insensitive
	const regex = new RegExp(`(${search})`, 'gi');

	// Replace all occurrences of the keyword with a highlighted version
	return message.replace(regex, '<span style="background: rgba(217,217,217,0.3); color: white;">$1</span>');
};

export const containsURL = (message: Message) => {
	if (
		new RegExp(
			'([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'
		).test(message.message)
	) {
		return true;
	}

	return false;
};

export const getUrlFromMessage = (message: Message) => {
	const urlPattern = /(https?:\/\/[^\s]+)/gi;
	const url = message.message.match(urlPattern);

	if (url) {
		return url[0];
	}

	return null;
};

export const getUrlFromText = (text: string) => {
	const urlPattern = /(https?:\/\/[^\s]+)/gi;
	const url = text.match(urlPattern);

	if (url) {
		return url[0];
	}

	return '';
};

export const isMemberJoinedMessage = (message: Message) => {
	return message.message === NEW_MEMBER_JOINED;
};

export const isMemberRevokedMessage = (message: Message) => {
	return message.message === REVOKED_MEMBERSHIP;
};

export function scrollIntoView(currentTarget: HTMLElement) {
	const target = currentTarget;

	const id = target.getAttribute('id');
	if (!id) {
		return;
	}

	const el = document.getElementById(id);
	if (!el) {
		return;
	}

	el.scrollIntoView({ block: 'start', behavior: 'smooth' });
	el.classList.add('highlight');

	setTimeout(() => {
		el.classList.remove('highlight');
	}, 1000);
}
