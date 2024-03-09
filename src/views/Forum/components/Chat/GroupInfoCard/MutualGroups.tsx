import { Box, ButtonBase, Skeleton } from '@mui/material';
import pluralize from 'pluralize';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Xmpp } from 'src/api/xmpp';
import { Paragraph3, Subtitle } from 'src/components/Typography';
import { AuthContext, ChatContext } from 'src/contexts';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import { useBookmarks } from 'src/hooks/useBookmarks';
import { RoomMember } from 'src/types/Xmpp.types';

type MutualGroup = {
	jid: string;
	roomInfo?: {
		name: string;
		description?: string;
	};
	roomMembers: RoomMember[];
};

export const MutualGroups = () => {
	const { data: bookmarks } = useBookmarks();
	const [isLoaded, setIsLoaded] = useState(false);
	const [mutualGroups, setMutualGroups] = useState<MutualGroup[]>([]);
	const { jid } = useContext(AuthContext);
	const { activeJid } = useContext(ChatContext);

	useEffect(() => {
		async function fetchData() {
			setIsLoaded(false);
			if (!bookmarks?.length) {
				setMutualGroups([]);
				return;
			}
			try {
				const currentRoomMembers = await Xmpp.getRoomMembers(activeJid);
				const currentRoomMember = currentRoomMembers.find(member => member.jid !== removeResourceFromJid(jid));
				const myJid = removeResourceFromJid(jid);

				const data = await Promise.all(
					bookmarks?.map(async bookmark => {
						const vCard = await Xmpp.getVCard(bookmark.jid);
						if (vCard?.role === 'ROOM') {
							const [roomInfo, roomMembers] = await Promise.all([
								Xmpp.getRoomInfo(bookmark.jid),
								Xmpp.getRoomMembers(bookmark.jid)
							]);
							const isMutualGroup = [myJid, currentRoomMember?.jid].every(user =>
								roomMembers.some(member => member.jid === user)
							);
							if (isMutualGroup) {
								return { jid: bookmark.jid, roomInfo, roomMembers };
							} else {
								return [];
							}
						} else {
							return [];
						}
					})
				);
				setMutualGroups(data.flat());
			} catch (e) {
				toast.error(String(e), { theme: 'colored' });
			}
			setIsLoaded(true);
		}
		fetchData();
	}, [activeJid, bookmarks, jid]);

	return (
		<Box sx={{ padding: 2, gap: 1.5, display: 'flex', flexDirection: 'column' }}>
			{isLoaded ? (
				<Paragraph3>
					{mutualGroups.length} {pluralize('mutual group', mutualGroups.length)}
				</Paragraph3>
			) : (
				<Skeleton variant="text" height={16} width="50%" />
			)}

			{isLoaded ? (
				mutualGroups.length ? (
					<Box display="flex" flexDirection="column" gap={1}>
						{mutualGroups.map(group => (
							<MutualGroup group={group} key={group.jid} />
						))}
					</Box>
				) : (
					<></>
				)
			) : (
				<MutualGroupSkeleton />
			)}
		</Box>
	);
};

const MutualGroup = ({ group }: { group: MutualGroup }) => {
	const { setActiveJid, infoOpen, setInfoOpen } = useContext(ChatContext);

	return (
		<Box display="flex" flexDirection="column" gap={0.5}>
			<ButtonBase
				onClick={() => {
					setActiveJid(group.jid);
					if (infoOpen) {
						setInfoOpen(false);
					}
				}}
				sx={{ justifyContent: 'flex-start', width: 'max-content', maxWidth: '100%' }}
			>
				<Subtitle noWrap>{group.roomInfo?.name}</Subtitle>
			</ButtonBase>
			<Paragraph3 color="text.secondary">
				{group.roomMembers.length} {pluralize('member', group.roomMembers.length)}
			</Paragraph3>
		</Box>
	);
};

const MutualGroupSkeleton = () => {
	return (
		<Box display="flex" flexDirection="column" gap={0.5}>
			<Skeleton variant="text" height={17} width="100%" />
			<Skeleton variant="text" height={16} width="50%" />
		</Box>
	);
};
