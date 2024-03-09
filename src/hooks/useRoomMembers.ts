import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import useSWRImmutable from 'swr/immutable';

export const useRoomMembers = (roomJid: string) => {
	return useSWRImmutable(roomJid ? [QUERY_KEYS.XMPP_ROOM_MEMBERS, roomJid] : null, () => Xmpp.getRoomMembers(roomJid));
};
