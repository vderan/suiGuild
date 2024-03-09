import { atom } from 'recoil';
import { Message } from 'src/types/Xmpp.types';

export const lastestRoomMessagesState = atom<Record<string, Message>>({
	key: 'lastestRoomMessagesState',
	default: {}
});
