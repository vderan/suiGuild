import { useContext } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { AuthContext } from 'src/contexts';
import useSWRImmutable from 'swr/immutable';

export const useBlockList = () => {
	const { jid } = useContext(AuthContext);
	return useSWRImmutable(jid ? ['BLOCKLIST', jid] : null, () => Xmpp.getBlockedList());
};
