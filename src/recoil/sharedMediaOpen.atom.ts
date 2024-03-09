import { atom } from 'recoil';

export const sharedMediaOpenState = atom<'links' | 'files' | undefined>({
	key: 'sharedMediaOpenState',
	default: undefined
});
