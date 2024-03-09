import { useMemo } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import useSWRImmutable from 'swr/immutable';

export const useRoomSharedMedia = (roomId: string) => {
	const { data: sharedMedia } = useSWRImmutable(roomId ? [QUERY_KEYS.XMPP_SHARED_MEDIA, roomId] : null, () =>
		Xmpp.getSharedMedia(roomId)
	);

	const links = useMemo(() => {
		if (!sharedMedia) {
			return [];
		}

		return sharedMedia.filter(media => media.type === 'link');
	}, [sharedMedia]);

	const files = useMemo(() => {
		if (!sharedMedia) {
			return [];
		}

		return sharedMedia.filter(media => media.type !== 'link');
	}, [sharedMedia]);

	return {
		links,
		files
	};
};
