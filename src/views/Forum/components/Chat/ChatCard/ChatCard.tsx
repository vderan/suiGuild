import { styled } from '@mui/system';
import { Box, Stack } from '@mui/material';
import { useDevice } from 'src/hooks/useDevice';
import { H2Title } from 'src/components/Typography';
import { AuthContext, ChatContext } from 'src/contexts';
import { TertiaryButton } from 'src/components/Button';
import { IconButton } from 'src/components/IconButton';
import { IMenu, Menu } from 'src/components/Menu';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { useRoomInfo } from 'src/hooks/useRoomInfo';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { SharedMediaLinks } from './SharedMediaLinks';
import { SharedMediaFiles } from './SharedMediaFiles';
import { GroupChatHeaderSkeleton } from 'src/components/Skeleton';
import { PageInfo } from 'src/types/Xmpp.types';
import { Xmpp } from 'src/api/xmpp';
import { Messages } from './Messages';
import { MessageField } from './MessageField';
import { delay } from 'src/helpers/async.helpers';
import { useNotificationSettings } from 'src/hooks/useNotificationSettings';
import { isNotificationsEnabled } from 'src/helpers/notification.helpers';
import { api } from 'src/api';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { useSWRConfig } from 'swr';
import { InviteMembers } from '../InviteMembers';
import { useRoomVCard } from 'src/hooks/useRoomAvatar';
import { StandaloneInputField } from 'src/components/InputField';
import { chatSearchState } from 'src/recoil/chatSearch';
import { Dialog } from 'src/components/Dialog';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { useIsOwner } from 'src/hooks/useIsOwner';
import { ChatHeader } from '../ChatHeader';
import { ErrorHandler } from 'src/helpers';

export const ChatCard = ({ sideBarOpen, onSideBarToggle }: { sideBarOpen?: boolean; onSideBarToggle?: () => void }) => {
	const { iSm } = useDevice();
	const { getUserByName } = useProfile();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [pageInfo, setPageInfo] = useState<PageInfo | undefined>(undefined);
	const [inviteMembersOpen, setInviteMembersOpen] = useState(false);
	const [open, setOpen] = useState(false);

	const setJoinedRooms = useSetRecoilState(joinedRoomsState);
	const sharedMediaOpen = useRecoilValue(sharedMediaOpenState);

	const { jid } = useContext(AuthContext);
	const { activeJid, setActiveJid, messages, historyComplete, chatOpen, isMobileChat } = useContext(ChatContext);

	const { mutate } = useSWRConfig();
	const { data: roomInfo, isLoading: roomInfoIsLoading } = useRoomInfo(activeJid);
	const { data: roomMembers, isLoading: roomMembersIsLoading } = useRoomMembers(activeJid);
	const {
		data: notificationSettings,
		mutate: notificationSettingsMutate,
		isLoading: notificationSettingsIsLoading
	} = useNotificationSettings();
	const { data: vCard } = useRoomVCard(activeJid);

	const isOwner = useIsOwner(activeJid);
	const isRoom = !vCard?.role || vCard.role === 'ROOM';
	const isNotifEnabled = isNotificationsEnabled(activeJid, notificationSettings ?? []);
	const user = roomMembers?.find(i => i.jid !== removeResourceFromJid(jid));
	const { data: userData } = useCustomSWR('getUserByName' + user?.name, () => getUserByName(user?.name));

	const isDeactivated = !isRoom && !userData?.isActive;

	useEffect(() => {
		const init = async () => {
			if (!activeJid) {
				setPageInfo(undefined);
			} else if (typeof messages[activeJid] == 'undefined') {
				const pageInfo = await Xmpp.loadRoomHistoryMessages(activeJid);

				// Set page info for infinite scroll
				setPageInfo(pageInfo);
			}
		};

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeJid]);

	const handleOnLeaveChat = async () => {
		try {
			await api.leaveRoom({ roomJid: activeJid, memberJid: removeResourceFromJid(jid) });

			// Remove room from joined rooms
			setJoinedRooms(prev => prev.filter(joinedRoomJid => joinedRoomJid !== activeJid));
			setActiveJid('');

			// Remove room from bookmarks
			await Xmpp.removeBookmark(activeJid, jid);

			// Invalidate bookmarks for current user
			await mutate([QUERY_KEYS.XMPP_BOOKMARKS, removeResourceFromJid(jid)]);
			setOpen(false);
		} catch (error) {
			ErrorHandler.process(error);
		}
	};

	const chatMenu = useMemo((): IMenu[] => {
		const handleOnNotificationToggle = async () => {
			await Xmpp.toggleNotifications(activeJid, !isNotifEnabled);
			await notificationSettingsMutate();
		};

		const menu: IMenu[] = [
			{
				label: 'Report',
				disabled: true
			},
			{
				label: isNotifEnabled ? 'Mute notifications' : 'Unmute notifications',
				action: handleOnNotificationToggle,
				disabled: notificationSettingsIsLoading
			}
		];

		if (isRoom) {
			menu.push({
				label: 'Leave group',
				action: () => setOpen(true)
			});
		}

		return menu;
	}, [isNotifEnabled, notificationSettingsIsLoading, isRoom, activeJid, notificationSettingsMutate]);

	const handleOnNext = async () => {
		const roomHistoryPageInfo = await Xmpp.loadRoomHistoryMessages(activeJid, {
			before: pageInfo?.first
		});

		setPageInfo(roomHistoryPageInfo);
	};

	const isLoaded = !!roomInfo && !!roomMembers && !roomInfoIsLoading && !roomMembersIsLoading;

	return (
		<StyledStack direction="column" gap={1}>
			<Box
				sx={theme => ({
					backdropFilter: { xs: 'none', sm: `blur(${theme.spacing(2.75)})` },
				})}
			>
				{chatOpen ? (
					<ChatHeader title={isRoom ? roomInfo?.name : userData?.userInfo.some?.displayName} />
				) : (
					<Box
						className="header-box"
						sx={theme => ({
							flexDirection: { xs: 'column', sm: 'row' },
							borderRadius: theme.spacing(1, 1, 0, 0),
							gap: { xs: 1.5, sm: 0 }
						})}
					>
						{isLoaded ? (
							<>
								<Box width="100%" overflow="hidden">
									<Stack direction="row" alignItems="center" spacing={1} width={sideBarOpen ? 'auto' : undefined}>
										{isMobileChat && activeJid && <IconButton icon="chevronLeft" onClick={() => setActiveJid('')} />}
										<H2Title noWrap>{isRoom ? roomInfo?.name : userData?.userInfo.some?.displayName}</H2Title>
										{!iSm && (
											<Menu
												detail={{
													label: <IconButton icon="moreHorizontal" />,
													id: 'chatMenu',
													menus: chatMenu
												}}
											/>
										)}
									</Stack>
								</Box>
								<Stack width={{ xs: '100%', sm: 'auto' }} direction="row" alignItems="center" justifyContent="space-between">
									<Stack direction="row" alignItems="center" gap={1.5}>
										<SearchBar />
										<IconButton
											icon="sidebar"
											onClick={onSideBarToggle}
										/>
										{!(isOwner || !isRoom) ? null :
											<TertiaryButton
												sx={{
													textWrap: 'nowrap'
												}}
												onClick={() => setInviteMembersOpen(true)}
											>
												Add people
											</TertiaryButton>}
									</Stack>
									{iSm && (
										<Menu
											detail={{
												label: <IconButton icon="moreHorizontal" />,
												id: 'chatMenu',
												menus: chatMenu
											}}
										/>
									)}
								</Stack>
							</>
						) : (
							<GroupChatHeaderSkeleton />
						)}
					</Box>
				)}
				{sharedMediaOpen !== undefined ? (
					<>{sharedMediaOpen === 'links' ? <SharedMediaLinks /> : <SharedMediaFiles />}</>
				) : (
					<>
						<Messages
							hasMore={!historyComplete[activeJid]}
							messagesEndRef={messagesEndRef}
							messages={messages[activeJid] ?? []}
							onNext={handleOnNext}
						/>
						{!chatOpen && (
							<MessageField
								isDeactivated={isDeactivated}
								onMessage={async (message, attachments) => {
									await Xmpp.sendMessage({ type: 'groupchat', to: activeJid, message, attachments });
									await delay(500, () => messagesEndRef.current?.scrollIntoView({ block: 'nearest' }));
								}}
							/>
						)}
					</>
				)}
				<InviteMembers roomJid={activeJid} open={inviteMembersOpen} onClose={() => setInviteMembersOpen(false)} />
				<Dialog
					width="dialogExtraSmall"
					open={open}
					title="Are you sure you want to leave this group?"
					isConfirmation
					onClose={() => setOpen(false)}
					onConfirm={handleOnLeaveChat}
					onConfirmText="Yes, Leave"
					onCancelText="Cancel"
				/>
			</Box>
			{chatOpen && (
				<MessageField
					isDeactivated={isDeactivated}
					onMessage={async (message, attachments) => {
						await Xmpp.sendMessage({ type: 'groupchat', to: activeJid, message, attachments });
						await delay(500, () => messagesEndRef.current?.scrollIntoView({ block: 'nearest' }));
					}}
				/>
			)}
		</StyledStack>
	);
};

const StyledStack = styled(Stack)(({ theme }) => ({
	width: '100%',
	borderRadius: theme.shape.borderRadius,
	display: 'flex',
	flexDirection: 'column',
	maxHeight: 'calc(100vh - 100px)',
	'& .header-box': {
		background: theme.palette.gradient2.main,
		padding: theme.spacing(2),
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		'& .line-box': {
			display: 'flex',
			alignItems: 'center',
			gap: theme.spacing(1.5)
		}
	},
	'& .chat-wrap': {
		overflowY: 'auto',
		display: 'flex',
		flexDirection: 'column-reverse',
		[theme.breakpoints.up('sm')]: {
			background: theme.palette.dark[700]
		},
		'& .chat-box': {
			display: 'flex',
			flexDirection: 'column',
			padding: theme.spacing(1),
			'& .userInfo': {
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: theme.spacing(1)
			},
			'& .chatDetail': {
				margin: theme.spacing(0, 4),
				maxWidth: '100%',
				overflowX: 'auto',
				whiteSpace: 'nowrap'
			},
			'&:hover': {
				background: theme.palette.dark[500],
				borderRadius: theme.spacing(1),
			}
		}
	},
	'& .input-box': {
		display: 'flex',
		alignItems: 'center',
		marginTop: 'auto',
		gap: theme.spacing(1.5),
	}
}))

const SearchBar = () => {
	const [isSearching, setIsSearching] = useState(false);
	const [search, setSearch] = useRecoilState(chatSearchState);
	const { activeJid } = useContext(ChatContext);

	useEffect(() => {
		setSearch('');
		setIsSearching(false);
	}, [activeJid, setSearch]);

	return (
		<>
			{!isSearching ? (
				<IconButton icon="search" onClick={() => setIsSearching(true)} />
			) : (
				<Box width={{ xs: '100%', sm: 200 }}>
					<StandaloneInputField
						endElement={
							<IconButton
								icon="close"
								onClick={() => {
									setSearch('');
									if (!search) {
										setIsSearching(false);
									}
								}}
							/>
						}
						name="search-chat"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</Box>
			)}
		</>
	);
};
