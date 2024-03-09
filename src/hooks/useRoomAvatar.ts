import { useContext } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { AuthContext } from 'src/contexts';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import useSWRImmutable from 'swr/immutable';

export const useRoomVCard = (roomJid: string) => {
	return useSWRImmutable([QUERY_KEYS.XMPP_ROOM_VCARD, roomJid], () => Xmpp.getVCard(roomJid));
};

export const useUserVCard = () => {
	const { jid } = useContext(AuthContext);
	return useSWRImmutable([QUERY_KEYS.XMPP_USER_VCARD, removeResourceFromJid(jid)], () =>
		Xmpp.getVCard(undefined, { setUserAvatar: true })
	);
};
