import { useContext, useMemo } from 'react';
import { useRoomMembers } from './useRoomMembers';
import { getUsernameFromJid } from 'src/helpers/xmpp.helpers';
import { AuthContext } from 'src/contexts';

export const useIsOwner = (roomJid: string) => {
	const { jid } = useContext(AuthContext);
	const { data: roomMembers } = useRoomMembers(roomJid);

	const isOwner = useMemo(() => {
		const me = roomMembers?.find(roomMember => getUsernameFromJid(roomMember.jid) === getUsernameFromJid(jid));
		if (!me) {
			return false;
		}

		return me.affiliation === 'owner';
	}, [roomMembers, jid]);

	return isOwner;
};
