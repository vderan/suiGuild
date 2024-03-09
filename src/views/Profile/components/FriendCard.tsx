import { Box, Link, Stack } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { useSocketEmit } from 'use-socket-io-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';
import { useSetRecoilState } from 'recoil';
import { TeamAvatar } from 'src/components/Avatar';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { H3Title } from 'src/components/Typography';
import { AuthContext, ChatContext, NotificationContext, UserInfo } from 'src/contexts';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { PUB_SUB_NODES } from 'src/constants/xmpp.constants';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getUsernameFromJid, removeResourceFromJid, toBareJid } from 'src/helpers/xmpp.helpers';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { useGilder } from 'src/hooks/useGilder';
import { api } from 'src/api';
import { useBookmarks } from 'src/hooks/useBookmarks';
import { Xmpp } from 'src/api/xmpp';
import { ErrorHandler } from 'src/helpers';

interface FriendCardProps {
	friend: UserInfo;
	isOwner?: boolean;
	isRequest?: boolean;
}

export const FriendCard = ({ friend, isOwner = false, isRequest = false }: FriendCardProps) => {
	const navigate = useNavigate();
	const { profile, loadUserInfo, jid } = useContext(AuthContext);
	const { notifications, getNotifications } = useContext(NotificationContext);
	const { setActiveJid } = useContext(ChatContext);
	const { emit } = useSocketEmit();
	const { acceptFriendRequest, rejectFriendRequest, removeFriend } = useGilder();
	const [isDeleteFriendModalOpened, setIsDeleteFriendModalOpened] = useState(false);
	const [isDMLoading, setIsDMLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data: bookmarks } = useBookmarks();
	const { mutate } = useSWRConfig();
	const setJoinedRooms = useSetRecoilState(joinedRoomsState);
	const setSharedMediaOpen = useSetRecoilState(sharedMediaOpenState);

	const friendName = friend.userInfo.some?.displayName;

	const filteredBookmarks = useMemo(() => {
		if (!bookmarks) return [];

		return bookmarks;
	}, [bookmarks]);

	const isMyProfile = profile?.displayName === friendName;

	const deleteFriend = async () => {
		if (!profile?.displayName || !friendName) {
			toast.warning("Username or Friend name doesn't exist", { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			await removeFriend(friendName, profile.displayName);
			emit('friend_request_deletion', [{ from: profile.displayName, to: friendName, type: 'friend-deletion' }]);
			await loadUserInfo();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
		setIsDeleteFriendModalOpened(false);
	};

	const markOneAsRead = async () => {
		const notification = notifications.find(
			_notification =>
				_notification.type === 'friend-request' &&
				_notification.to === profile?.displayName &&
				_notification.from === friendName
		);
		if (!notification) return;
		await api.markAsRead(notification._id);
		await getNotifications();
	};

	const handleFriendRequest = async (isAccept: boolean) => {
		if (!profile?.displayName || !friendName) {
			toast.warning("Username or Friend name doesn't exist", { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			if (isAccept) {
				await acceptFriendRequest(friendName, profile.displayName);
				await markOneAsRead();
				emit('friend_request_approval', [{ from: profile.displayName, to: friendName, type: 'friend-approval' }]);
			} else {
				await rejectFriendRequest(friendName, profile.displayName);
				await markOneAsRead();
				emit('friend_request_rejection', [{ from: profile.displayName, to: friendName, type: 'friend-rejection' }]);
			}
			await loadUserInfo();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	const existingBookmark = async () => {
		for (const bookmark of filteredBookmarks) {
			const card = await Xmpp.getVCard(bookmark.jid);
			const members = await Xmpp.getRoomMembers(bookmark.jid);

			if (
				card?.role === 'DM' &&
				members.some(member => member.name === getUsernameFromJid(jid)) &&
				members.some(member => member.name === friendName)
			) {
				return bookmark;
			}
		}

		return null;
	};

	const sendMessage = async () => {
		if (!friend.isActive) {
			toast.warning('This user was deactivated!', { theme: 'colored' });
			return;
		} else if (!friendName) {
			toast.warning("Friend name doesn't exist!", { theme: 'colored' });
			return;
		}
		try {
			setIsDMLoading(true);

			const bookmark = await existingBookmark();

			if (bookmark) {
				setActiveJid(bookmark.jid);
			} else {
				const roomJid = await Xmpp.createRoom(friendName);
				if (!roomJid) {
					setIsDMLoading(false);
					return toast.error('Failed to create room', { theme: 'colored' });
				}

				await Xmpp.setRoomVCard({ roomJid, roomRole: 'DM' });
				await Xmpp.addBookmark({ roomJid, userJid: jid, name: friendName });
				await Xmpp.publishPubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);
				await Xmpp.joinRoom(roomJid);
				await Xmpp.subscribePubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);

				await Xmpp.inviteUser(roomJid, toBareJid(friendName));
				await Xmpp.subscribeToPresence(friendName);

				setJoinedRooms(prev => [...prev, roomJid]);
				setActiveJid(roomJid);
				setSharedMediaOpen(undefined);

				await mutate([QUERY_KEYS.XMPP_BOOKMARKS, removeResourceFromJid(jid)]);
			}
			navigate('/chat');
		} catch (error) {
			ErrorHandler.process(error);
		}
		setIsDMLoading(false);
	};

	return (
		<Stack
			sx={{
				borderRadius: 1,
				padding: 3,
				backgroundColor: theme => theme.palette.dark[700],
				gap: 3
			}}
		>
			<Link component={NavLink} to={`/profile/0x${friend?.userAddress}`} gap={1} display="flex" flexDirection="column">
				<TeamAvatar image={friend?.userInfo.some?.avatar.url ? ipfsUrl(friend.userInfo.some.avatar.url) : ''} />
				<H3Title noWrap>{friend?.userInfo.some?.displayName}</H3Title>
			</Link>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
				{isRequest ? (
					<>
						<PrimaryButton size="small" onClick={() => handleFriendRequest(true)} disabled={isSubmitting}>
							Accept
						</PrimaryButton>
						<SecondaryButton size="small" onClick={() => handleFriendRequest(false)} disabled={isSubmitting}>
							Decline
						</SecondaryButton>
					</>
				) : (
					<>
						{!isMyProfile && profile?.displayName && (
							<PrimaryButton size="small" onClick={sendMessage} loading={isDMLoading}>
								Send Message
							</PrimaryButton>
						)}
						{isOwner && (
							<SecondaryButton size="small" onClick={() => setIsDeleteFriendModalOpened(true)} disabled={isDMLoading}>
								Remove Friend
							</SecondaryButton>
						)}
					</>
				)}
			</Box>

			<Dialog
				title="Do you want to remove this friend?"
				width="dialogExtraSmall"
				open={isDeleteFriendModalOpened}
				onClose={() => setIsDeleteFriendModalOpened(false)}
				isConfirmation
				onConfirm={deleteFriend}
				onConfirmText="Yes, delete"
				onCancelText="Cancel"
				isCancelDisabled={isSubmitting}
				isConfirmLoading={isSubmitting}
			/>
		</Stack>
	);
};
