import { atom } from 'recoil';

export const messageAttachmentsCountState = atom<number>({
	key: 'messageAttachmentsCountState',
	default: 0
});
