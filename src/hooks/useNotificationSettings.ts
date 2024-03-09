import { useContext } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { AuthContext } from 'src/contexts';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import useSWRImmutable from 'swr/immutable';

export const useNotificationSettings = () => {
	const { jid } = useContext(AuthContext);

	return useSWRImmutable(jid ? [QUERY_KEYS.XMPP_NOTIFICATION_SETTINGS, removeResourceFromJid(jid)] : null, () =>
		Xmpp.getNotificationSettings()
	);
};
