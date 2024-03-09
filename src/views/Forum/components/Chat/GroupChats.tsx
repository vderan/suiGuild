import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { PreTitle, Paragraph2, Paragraph3 } from 'src/components/Typography';
import Skeleton from '@mui/material/Skeleton';
import isURL from 'validator/lib/isURL';
import { AuthContext, ChatContext } from 'src/contexts';
import { SecondaryButton } from 'src/components/Button';
import { MediumAvatar, CustomAvatar } from 'src/components/Avatar';
import { IconButton } from 'src/components/IconButton';
import { StandaloneInputField } from 'src/components/InputField';
import { Menu } from 'src/components/Menu';
import { useBookmarks } from 'src/hooks/useBookmarks';
import { Bookmark, Message } from 'src/types/Xmpp.types';
import { Icon } from 'src/components/Icon';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRoomVCard } from 'src/hooks/useRoomAvatar';
import { GroupChatsSkeleton } from 'src/components/Skeleton';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { Xmpp } from 'src/api/xmpp';
import { PUB_SUB_NODES } from 'src/constants/xmpp.constants';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { useNotificationSettings } from 'src/hooks/useNotificationSettings';
import { isNotificationsEnabled } from 'src/helpers/notification.helpers';
import { useRoomInfo } from 'src/hooks/useRoomInfo';
import { NewConversation } from './ChatCard/NewConversation';
import { lastestRoomMessagesState } from 'src/recoil/lastestRoomMessage';
import { formatLatestRoomMessageDate } from 'src/helpers/date.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getUsernameFromJid, removeResourceFromJid, isGifUrl } from 'src/helpers/xmpp.helpers';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { Dialog } from 'src/components/Dialog';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { mutate } from 'swr';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { useIsOwner } from 'src/hooks/useIsOwner';
import { ChatHeader } from './ChatHeader';
import { ErrorHandler } from 'src/helpers';

export const GroupChats = () => {
	const [search, setSearch] = useState('');
	const [conversationOpen, setConversationOpen] = useState(false);
	const [searchIn, setSearchIn] = useState<'all' | 'archived' | 'unread'>('all');

	const setSharedMediaOpen = useSetRecoilState(sharedMediaOpenState);
	const lastestRoomMessages = useRecoilValue(lastestRoomMessagesState);
	const [joinedRooms, setJoinedRooms] = useRecoilState(joinedRoomsState);

	const { jid } = useContext(AuthContext);
	const { activeJid, setActiveJid, chatOpen } = useContext(ChatContext);
	const { data: bookmarks, isLoading } = useBookmarks();
	const { data: notificationSettings, mutate: mutateNotificationSettings } = useNotificationSettings();

	const searchedBookmarks = useMemo(() => {
		if (!bookmarks) {
			return [];
		}

		if (!search) {
			return bookmarks;
		}

		return bookmarks.filter(bookmark => bookmark.name.toLowerCase().includes(search.toLowerCase()));
	}, [bookmarks, search]);

	const handleOnJoinRoom = async (roomJid: string) => {
		try {
			setActiveJid(roomJid);
			setSharedMediaOpen(undefined);

			// Check if room is already joined
			if (!joinedRooms.includes(roomJid)) {
				await Xmpp.joinRoom(roomJid);
				await Xmpp.subscribePubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);
				const data = await Xmpp.getRoomMembers(roomJid);
				if (data.length === 2) {
					const user = data.find(i => i.jid !== removeResourceFromJid(jid));
					await Xmpp.subscribeToPresence(user?.jid || '');
				}

				// Add room to joined rooms
				setJoinedRooms(prev => [...prev, roomJid]);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleOnNotificationToggle = async (roomJid: string, isEnabled: boolean) => {
		await Xmpp.toggleNotifications(roomJid, isEnabled);
		await mutateNotificationSettings();
	};

	const isLoaded = !!bookmarks && !isLoading;

	return (
		<StyledBox>
			{!chatOpen ? (
				<Box className="new-wrap">
					<SecondaryButton startIcon="add" onClick={() => setConversationOpen(true)}>
						New conversation
					</SecondaryButton>
					<Box className="search-wrap">
						<StandaloneInputField
							startIcon="search"
							name="search"
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search"
						/>

						<Menu
							detail={{
								label: <IconButton icon="setting" />,
								id: 'searchMenu',
								menus: [
									{
										label: 'All',
										action: () => setSearchIn('all'),
										selected: searchIn === 'all'
									}
									// {
									// 	label: 'Archived',
									// 	action: () => setSearchIn('archived'),
									// 	selected: searchIn === 'archived'
									// },
									// {
									// 	label: 'Unread',
									// 	action: () => setSearchIn('unread'),
									// 	selected: searchIn === 'unread'
									// }
								]
							}}
						/>
					</Box>
				</Box>
			) : (
				<></>
			)}
			{isLoaded ? (
				<>
					{searchedBookmarks.length ? (
						<>
							<Box className="groupList-wrap" sx={{ maxHeight: { xs: 'auto', sm: 'calc(100vh - 250px)' } }}>
								{chatOpen && <ChatHeader />}
								<Box
									sx={{
										maxHeight: theme => (chatOpen ? theme.spacing(43) : 'auto'),
										overflowY: 'auto'
									}}
								>
									{searchedBookmarks.map(bookmark => {
										const isNotifsEnabled = isNotificationsEnabled(bookmark.jid, notificationSettings ?? []);

										return (
											<GroupChat
												key={bookmark.jid}
												bookmark={bookmark}
												isActive={bookmark.jid === activeJid}
												onJoinRoom={() => handleOnJoinRoom(bookmark.jid)}
												isNotifsEnabled={isNotifsEnabled}
												latestMessage={lastestRoomMessages[bookmark.jid]}
												onToggleNotification={() => handleOnNotificationToggle(bookmark.jid, !isNotifsEnabled)}
											/>
										);
									})}
								</Box>
							</Box>
						</>
					) : null}
				</>
			) : (
				<Box className="groupList-wrap">
					<GroupChatsSkeleton />
				</Box>
			)}
			<NewConversation open={conversationOpen} onClose={() => setConversationOpen(false)} />
		</StyledBox>
	);
};

const StyledBox = styled(Box)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(1),
	[theme.breakpoints.down('xs')]: {
		padding: theme.spacing(0, 2)
	},
	'& .new-wrap': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(1),
		paddingBottom: theme.spacing(3),
		borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
		[theme.breakpoints.up('lg')]: {
			marginRight: theme.spacing(3)
		}
	},
	'& .search-wrap': {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1.5)
	},
	'& .search-menu-btn': {
		maxWidth: theme.spacing(5),
		height: '100%',
		padding: theme.spacing(1.125)
	},
	'& .groupList-wrap': {
		overflowY: 'auto',
		backdropFilter: `blur(${theme.spacing(2.75)})`,
		'& .groupInfo-box': {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			gap: theme.spacing(1.5),
			'& .avatar': {
				position: 'relative'
			},
			'& .info': {
				display: 'flex',
				width: '100%',
				flexDirection: 'column',
				gap: theme.spacing(0.5),
				overflow: 'hidden',
				'& .name-date': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: theme.spacing(1),
					'& .date': {
						display: 'flex'
					},
					'& .menu': {
						display: 'flex',
						opacity: 0
					},
					'& .chat-name': {
						height: theme.spacing(2.75)
					}
				}
			},
			'&.active': {
				borderRight: `${theme.spacing(0.25)} solid`,
				borderImageSlice: 1,
				borderImageSource: theme.palette.gradient1.main,
				'& .info .name-date .chat-name': {
					background: theme.palette.gradient1.main,
					backgroundClip: 'text',
					textFillColor: 'transparent'
				}
			},
			'&:hover': {
				cursor: 'pointer',
				'& .info .name-date': {
					'& .date': {
						display: 'none'
					},
					'& .chat-name': {
						background: theme.palette.gradient1.main,
						backgroundClip: 'text',
						textFillColor: 'transparent'
					},
					'& .menu': {
						opacity: 1
					}
				}
			}
		}
	}
}));

export const MemberAvatar = ({ roomJid }: { roomJid: string }) => {
	const { getUserByName } = useProfile();
	const { jid } = useContext(AuthContext);
	const { data: roomMembers } = useRoomMembers(roomJid);

	const roomMember = roomMembers?.find(member => member.name !== getUsernameFromJid(jid));
	const { data: user } = useCustomSWR('getUserByName' + roomMember?.name, () => getUserByName(roomMember?.name));
	return (
		<CustomAvatar
			image={user?.userInfo.some?.avatar.url ? ipfsUrl(user?.userInfo.some.avatar.url) : ''}
			sx={{
				width: 40,
				height: 40
			}}
		/>
	);
};

export const GroupChat = ({
	bookmark,
	isActive,
	onJoinRoom,
	isNotifsEnabled,
	onToggleNotification,
	latestMessage
}: {
	bookmark: Bookmark;
	isActive: boolean;
	isNotifsEnabled: boolean;
	latestMessage?: Message;
	onJoinRoom: () => void;
	onToggleNotification: () => void;
}) => {
	const { data: vCard } = useRoomVCard(bookmark.jid);
	const { data: roomInfo } = useRoomInfo(bookmark.jid);
	const { data: roomMembers } = useRoomMembers(bookmark.jid);

	const [isGif, setIsGif] = useState(false);
	const [isLatestMessageChecking, setIsLatestMessageChecking] = useState(true);

	const { jid } = useContext(AuthContext);
	const setJoinedRooms = useSetRecoilState(joinedRoomsState);
	const { activeJid, setActiveJid } = useContext(ChatContext);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	useEffect(() => {
		const init = async () => {
			setIsLatestMessageChecking(true);

			if (!latestMessage?.message) {
				setIsGif(false);
			} else if (isURL(latestMessage.message)) {
				const isGif = await isGifUrl(latestMessage);
				setIsGif(isGif);
			}

			setIsLatestMessageChecking(false);
		};

		init();
	}, [latestMessage]);

	const isOwner = useIsOwner(activeJid);
	const isRoom = !vCard?.role || vCard.role === 'ROOM';
	const roomMember = roomMembers?.find(member => member.name !== getUsernameFromJid(jid));
	const filteredRoomMembers = useMemo(() => {
		if (!roomMembers) return [];

		return roomMembers.filter(member => member.name !== getUsernameFromJid(jid));
	}, [jid, roomMembers]);

	useEffect(() => {
		if (!latestMessage) {
			Xmpp.loadLatestRoomHistoryMessages(bookmark.jid);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDeleteChat = async () => {
		try {
			if (isRoom) {
				await Promise.all(filteredRoomMembers.map(item => Xmpp.revokeMembership(activeJid, item.jid)));
				await api.leaveRoom({ roomJid: bookmark.jid, memberJid: removeResourceFromJid(jid) });
				// Remove room from joined rooms
				setJoinedRooms(prev => prev.filter(joinedRoomJid => joinedRoomJid !== bookmark.jid));
				if (bookmark.jid === activeJid) {
					setActiveJid('');
				}

				// Remove room from bookmarks
				await Xmpp.removeBookmark(bookmark.jid, jid);

				// Invalidate bookmarks for current user
				await mutate([QUERY_KEYS.XMPP_BOOKMARKS, removeResourceFromJid(jid)]);
				setIsDeleteModalOpen(false);
			}
		} catch (error) {
			ErrorHandler.process(error);
		}
	};

	const isOnlyAttachmentsInMessage = !latestMessage?.message && latestMessage?.attachments.length;
	console.log(isOnlyAttachmentsInMessage);
	const isOnlyAttachmentsIsImage =
		isOnlyAttachmentsInMessage && latestMessage?.attachments.every(attachment => attachment.type === 'image');

	const getLatestMessageIcon = () => {
		if (isOnlyAttachmentsIsImage) {
			return 'image';
		} else if (isOnlyAttachmentsInMessage) {
			return 'file';
		} else if (isGif) {
			return 'gif';
		}

		return 'file';
	};

	return (
		<Box
			className={`groupInfo-box ${isActive ? 'active' : ''}`}
			onClick={onJoinRoom}
			sx={theme => ({
				padding: { xs: 1.5, sm: theme.spacing(1.5, 3, 1.5, 1.5) }
			})}
		>
			<Box className="avatar">
				{isRoom ? (
					<MediumAvatar
						image={vCard?.avatar ? ipfsUrl(vCard?.avatar) : ''}
						sx={{
							width: 40,
							height: 40
						}}
					>
						<Icon icon="users" fontSize="small" />
					</MediumAvatar>
				) : (
					<MemberAvatar roomJid={bookmark.jid} />
				)}
			</Box>
			<Box className="info">
				<Box className="name-date">
					<PreTitle className="chat-name" noWrap>
						{isRoom ? roomInfo?.name : roomMember?.name}
					</PreTitle>
					<Box className="menu">
						<Menu
							detail={{
								label: <IconButton size="small" icon="moreHorizontal" />,
								id: 'userMenu',
								menus: [
									{
										label: isNotifsEnabled ? 'Mute notifications' : 'Unmute notifications',
										action: onToggleNotification
									},
									// {
									// 	label: 'Mark as unread',
									// 	disabled: true
									// },
									// {
									// 	label: 'Archive',
									// 	disabled: true
									// },
									// {
									// 	label: 'Clear history',
									// 	disabled: true
									// },
									...(isOwner || !isRoom
										? [
												{
													label: isRoom ? 'Delete group' : 'Delete DM',
													action: () => setIsDeleteModalOpen(true)
												}
										  ]
										: [])
								]
							}}
						/>
					</Box>
					<Box className="date">
						<Paragraph3 noWrap>{formatLatestRoomMessageDate(latestMessage?.date ?? bookmark.date)}</Paragraph3>
					</Box>
				</Box>
				<Box sx={{ display: 'flex' }}>
					{!isLatestMessageChecking ? (
						latestMessage ? (
							isOnlyAttachmentsInMessage || isGif ? (
								<Icon icon={getLatestMessageIcon()} fontSize="small" />
							) : (
								<Paragraph2 noWrap sx={{ width: 220 }}>
									{latestMessage.message}
								</Paragraph2>
							)
						) : (
							<Paragraph2 noWrap>
								<i>No messages yet</i>
							</Paragraph2>
						)
					) : (
						<Skeleton variant="text" width="100%" />
					)}
				</Box>
			</Box>
			<Dialog
				width="dialogExtraSmall"
				open={isDeleteModalOpen}
				title="Are you sure you want to delete this group?"
				isConfirmation
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteChat}
				onConfirmText="Yes, Delete"
				onCancelText="Cancel"
			/>
		</Box>
	);
};
