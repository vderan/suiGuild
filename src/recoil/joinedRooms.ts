import { atom } from 'recoil';

export const joinedRoomsState = atom<string[]>({
	key: 'joinedRoomsState',
	default: []
});
