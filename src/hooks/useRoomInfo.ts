import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import useSWRImmutable from 'swr/immutable';

export const useRoomInfo = (roomJid: string) => {
	return useSWRImmutable([QUERY_KEYS.XMPP_ROOM_INFO, roomJid], () => Xmpp.getRoomInfo(roomJid));
};
