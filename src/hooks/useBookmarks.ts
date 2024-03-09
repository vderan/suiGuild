import { useContext } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { AuthContext } from 'src/contexts';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import { Bookmark } from 'src/types/Xmpp.types';
import useSWRImmutable from 'swr/immutable';

export const useBookmarks = (onSuccess?: (bookmarks: Bookmark[]) => void) => {
	const { jid } = useContext(AuthContext);

	const data = useSWRImmutable(
		jid ? [QUERY_KEYS.XMPP_BOOKMARKS, removeResourceFromJid(jid)] : null,
		() => Xmpp.getBookmarks(jid),
		{
			onSuccess: data => {
				if (onSuccess) {
					onSuccess(data);
				}
			}
		}
	);

	return data;
};
