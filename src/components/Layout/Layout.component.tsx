import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDevice } from 'src/hooks/useDevice';
import { Container, Stack } from '@mui/material';
import { Main } from 'src/components/Layout/Container';
import { Header } from 'src/components/Layout/Header';
import { BottomNavigationBar } from 'src/components/Layout/Sidebar';
import { AuthContext, ChatContext } from 'src/contexts';
import { Xmpp } from 'src/api/xmpp';
import { useBlockList } from 'src/hooks/useBlockedList';
import { getNickname, getUsernameFromJid, removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import {
	isNotificationsEnabled,
	requestNotificationPermission,
	showNotification
} from 'src/helpers/notification.helpers';
import { useNotificationSettings } from 'src/hooks/useNotificationSettings';
import { useBookmarks } from 'src/hooks/useBookmarks';
import { PUB_SUB_NODES } from 'src/constants/xmpp.constants';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { useSWRConfig } from 'swr';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { lastestRoomMessagesState } from 'src/recoil/lastestRoomMessage';
import { UsernameDialog } from '../UsernameDialog';
import { GradientIcon } from '../Icons/GradientIcon';
import { SidebarMenu } from './Sidebar/SidebarMenu';

export const Layout = ({ isSidebarAlwaysClosed = false }: { isSidebarAlwaysClosed?: boolean }) => {
	const { pathname } = useLocation();
	const { iMid } = useDevice();
	const navigate = useNavigate();

	const setLastestRoomMessage = useSetRecoilState(lastestRoomMessagesState);
	const [joinedRooms, setJoinedRooms] = useRecoilState(joinedRoomsState);
	const [isTabActive, setIsTabActive] = useState(!document.hidden);
	const { jid } = useContext(AuthContext);
	const { activeJid, messages, setActiveJid, setHistoryComplete, addHistory, addMessage } = useContext(ChatContext);
	const { profile } = useContext(AuthContext);

	const { mutate } = useSWRConfig();
	const { data: notificationSettings } = useNotificationSettings();
	const { data: blockedList } = useBlockList();
	const { data: bookmarks, mutate: mutateBookmarks } = useBookmarks();
	const { data: roomMembers, mutate: mutateRoomMembers } = useRoomMembers(activeJid);

	useEffect(() => {
		const init = async () => {
			await requestNotificationPermission();
		};

		init();
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			setIsTabActive(!document.hidden);
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	useEffect(() => {
		if (!jid) {
			return;
		}

		Xmpp.onMessage({
			onError: async ({ error, name, roomJid, type }) => {
				console.log('onError', { error, name, roomJid, type });

				// Catch if user is not authorized to join room
				if (name === 'registration-required' || (type === 'auth' && name === 'forbidden')) {
					const formattedRoomJid = removeResourceFromJid(roomJid);

					// Remove room from joined rooms
					setJoinedRooms(prev => prev.filter(joinedRoomJid => joinedRoomJid !== formattedRoomJid));
					setActiveJid('');

					// Remove room from bookmarks
					await Xmpp.removeBookmark(formattedRoomJid, jid);

					// Invalidate bookmarks for current user
					await mutateBookmarks();
				}
			},
			onNewBatch: (_, complete) => {
				setHistoryComplete(activeJid, complete);
			},
			// oneOnOneHistoryMessage: message => {
			// 	const jid = message.to;
			// 	addOneOnOneMessageHistory(message, jid);
			// },
			onOneToManyHistoryMessage: message => {
				const roomJid = message.from;
				if (blockedList?.includes(message.sender)) {
					return;
				}

				addHistory(message, roomJid);
			},
			// onOneOnOneMessage: async message => {
			// 	if (blockedList?.includes(message.from)) {
			// 		return;
			// 	}

			// 	addOneOnOneMessage(message, activeOneOnOneJID);
			// },
			onOneToManyMessage: async (message, type) => {
				const roomJid = message.from;

				if (blockedList?.includes(message.sender)) {
					return;
				}

				// If there is a MAM message incoming and there is no active chat, this must be a loadLatestRoomHistoryMessages
				// Meaning we are fetching the latest messages from the room and we don't want to add the message to the state
				if (!activeJid && type === 'mam') {
					setLastestRoomMessage(prevState => ({
						...prevState,
						[roomJid]: message
					}));
					return;
				}

				// Set incoming message to lastest room message
				if (type === 'message') {
					setLastestRoomMessage(prevState => ({
						...prevState,
						[roomJid]: message
					}));
				}

				await addMessage(message, roomJid, type);

				// Skip notification if its from MAM (message archive)
				// Skip notification if notifications are disabled
				if (type === 'mam' || !isNotificationsEnabled(roomJid, notificationSettings ?? [])) {
					return;
				}

				// Chat is inactive, or active chat is not the same as the roomJID in the message
				if (!isTabActive || !activeJid || (typeof messages[activeJid] !== 'undefined' && activeJid !== roomJid)) {
					// Skip notification if bookmark doesn't exist, meaning the user is not subscribed to the room
					const bookmark = bookmarks?.find(bookmark => bookmark.jid === roomJid);
					if (!bookmark) {
						return;
					}

					// Add notification
					const notification = await showNotification(
						bookmark.name,
						`${message.sender ? getUsernameFromJid(message.sender) : ''}: ${message.message}`
					);

					if (notification) {
						notification.onclick = () => {
							notification.close();

							// Set active chat
							setActiveJid(message.from);

							// Navigate to chat
							navigate('/chat');
						};
					}
				}
			},
			// User got invited to a group chat
			// Will trigger only for the user that got invited
			onInvitedToGroupChat: async ({ roomJid, userJid, name }) => {
				// Check if room is already joined
				if (!joinedRooms.includes(roomJid)) {
					// Add room to bookmarks if it doesn't exist
					if (!bookmarks?.some(bookmark => bookmark.jid === roomJid)) {
						await Xmpp.subscribePubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);
						await Xmpp.addBookmark({ roomJid, userJid, name });
						await mutateBookmarks();
					}

					// Join room (presence)
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
			},
			// User joined a group chat as a member (affiliation: member)
			// Will trigger only for the users in the group chat
			onNewMember: async () => {
				await mutateRoomMembers();
			},
			onMemberRevoked: async (roomJid, memberJid) => {
				// If removed member is current user
				if (jid && getUsernameFromJid(memberJid) === getUsernameFromJid(jid)) {
					// Remove room from joined rooms
					setJoinedRooms(prev => prev.filter(joinedRoomJid => joinedRoomJid !== roomJid));

					await Xmpp.unSubscribePubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);
					await Xmpp.removeBookmark(roomJid, memberJid);
					await Xmpp.exitRoom(`${roomJid}/${getNickname(memberJid)}`, memberJid);

					// Invalidate bookmarks for current user
					await mutateBookmarks();

					// If current chat is the same as the room that the member got revoked from
					if (activeJid === roomJid) {
						setActiveJid('');
					}
				}

				// Invalidate room members for all members
				await mutateRoomMembers();
			},
			onRoomDestroyed: async roomJid => {
				navigate('/');

				// Remove room from joined rooms
				setJoinedRooms(prev => prev.filter(joinedRoomJid => joinedRoomJid !== roomJid));

				await Xmpp.removeBookmark(roomJid, jid);

				// Invalidate bookmarks for current user
				await mutateBookmarks();
			},
			onRoomConfigurationChange: async roomJid => {
				// Invalidate room avatar
				await mutate([QUERY_KEYS.XMPP_ROOM_VCARD, roomJid]);

				// Invalidate room info (name change)
				await mutate([QUERY_KEYS.XMPP_ROOM_INFO, roomJid]);
			},
			onMemberAvatarChange: async () => {
				// Invalidate member avatar
				await mutateRoomMembers();
			}
		});

		return () => {
			Xmpp.removeMessageListener();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jid, activeJid, isTabActive, bookmarks, notificationSettings, joinedRooms, roomMembers, blockedList]);

	const isChat = pathname.includes('chat');

	return (
		<Stack>
			<UsernameDialog />
			<Header isSidebarAlwaysClosed={isSidebarAlwaysClosed} />
			{iMid && isChat && activeJid ? null : iMid && <BottomNavigationBar />}
			<Main>
				{!iMid && <SidebarMenu isSidebarAlwaysClosed={isSidebarAlwaysClosed} />}
				<Container
					sx={theme => ({
						overflowY: 'auto',
						maxHeight: theme => `calc(100vh - ${theme.spacing(9)})`,
						minHeight: theme => `calc(100vh - ${theme.spacing(9)})`,
						paddingBottom: (profile?.displayName && !isChat) || iMid ? 10 : 'initial',
						[theme.breakpoints.down('lg')]: {
							overflowY: 'inital',
							maxHeight: 'initial',
							minHeight: 'initial'
						}
					})}
					maxWidth={false}
				>
					<Outlet />
				</Container>
			</Main>

			<GradientIcon />
		</Stack>
	);
};
