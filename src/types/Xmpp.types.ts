import { Element } from '@xmpp/xml';

export enum XmppErrorType {
	'not-authorized' = 'not-authorized'
}

export interface Message {
	id: string;
	to: string;
	from: string;
	message: string;
	date: Date;
	attachments: MessageAttachment[];
	sender: string;
	avatar?: string;
}

export interface MessageAttachment {
	type: MessageAttachmentType;
	mimeType: string;
	name: string;
	size: number;
	url: string;
}

export type MessageAttachmentType = 'image' | 'video' | 'audio' | 'file';

export interface Bookmark {
	jid: string;
	nick: string;
	name: string;
	autoJoin: boolean;
	date: string;
}

export interface RoomMember {
	jid: string;
	name: string;
	affiliation: RoomMemberAffiliation;
	avatar: string;
}

export type RoomMemberAffiliation = 'owner' | 'admin' | 'member' | 'none';

export type RoomMemberRole = 'moderator' | 'participant';

export interface NotificationSetting {
	roomJid: string;
	enabled: boolean;
}

export type MessageType = 'mam' | 'message';

export interface PageInfo {
	count: number;
	first: string;
	last: string;
}

export interface MAMFilters {
	max?: number;
	before?: string;
	after?: string;
}

export interface SharedMedia {
	itemId: string;
	isGiphy: boolean;
	type: string;
	id: string;
	name: string;
	src: string;
	sender: string;
	avatar: string;
	size: number;
	date: Date;
}

export interface XmppError {
	condition: string;
	text: string;
	application?: string;
	type: string;
	element: Element;
}

export type RoomRole = 'DM' | 'ROOM';
