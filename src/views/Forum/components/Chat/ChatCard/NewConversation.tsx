import { Box } from '@mui/material';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { Xmpp } from 'src/api/xmpp';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { PUB_SUB_NODES } from 'src/constants/xmpp.constants';
import { AuthContext, ChatContext } from 'src/contexts';
import { getUsernameFromJid, removeResourceFromJid, toBareJid } from 'src/helpers/xmpp.helpers';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { newConversationSchema } from 'src/schemas/new-conversation.schema';
import { useSWRConfig } from 'swr';
import { ChatHeader } from '../ChatHeader';
import { useBookmarks } from 'src/hooks/useBookmarks';
import { RoomMember } from 'src/types/Xmpp.types';
import { Members } from './Members';

interface ConversationFormData {
	member: string;
	members: string[];
}

export const NewConversation = ({
	open = false,
	onClose = () => console.log(''),
	isCreating = false,
	setIsCreating = () => console.log('')
}: {
	open?: boolean;
	onClose?: () => void;
	isCreating?: boolean;
	setIsCreating?: () => void;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const setSharedMediaOpen = useSetRecoilState(sharedMediaOpenState);
	const setJoinedRooms = useSetRecoilState(joinedRoomsState);

	const { jid } = useContext(AuthContext);
	const { setActiveJid, conversationOpen, setConversationCreating } = useContext(ChatContext);
	const { mutate } = useSWRConfig();
	const { data: bookmarks } = useBookmarks();

	const filteredBookmarks = useMemo(() => {
		if (!bookmarks) return [];

		return bookmarks;
	}, [bookmarks]);

	useEffect(() => {
		const init = async () => {
			if (isCreating) {
				formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
			}
		};

		init();
	}, [isCreating]);

	const existingBookmark = async (friendname: string) => {
		for (const bookmark of filteredBookmarks) {
			const card = await Xmpp.getVCard(bookmark.jid);
			const members = await Xmpp.getRoomMembers(bookmark.jid);

			if (
				card?.role === 'DM' &&
				members.some((member: RoomMember) => member.name === getUsernameFromJid(jid)) &&
				members.some((member: RoomMember) => member.name === friendname)
			) {
				return bookmark;
			}
		}

		return null;
	};

	const handleOnFormSubmit = async (data: ConversationFormData) => {
		setIsSubmitting(true);
		setConversationCreating(true);

		try {
			const isGroup = data.members.length > 1;
			const roomName = data.members.join(', ');
			const roomJid = await Xmpp.createRoom(roomName);
			if (!roomJid) {
				setIsSubmitting(false);
				return toast.error('Failed to create room', { theme: 'colored' });
			}

			if (!isGroup) {
				const bookmark = await existingBookmark(data.members[0]);

				if (bookmark) {
					setIsSubmitting(false);
					setConversationCreating(false);
					return toast.warning('You already have DM with this user!', { theme: 'colored' });
				}
			}

			await Xmpp.setRoomVCard({ roomJid, roomRole: isGroup ? 'ROOM' : 'DM' });
			await Xmpp.addBookmark({ roomJid, userJid: jid, name: roomName });
			await Xmpp.publishPubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);
			await Xmpp.joinRoom(roomJid);
			await Xmpp.subscribePubSubNode(roomJid, PUB_SUB_NODES.SHARED_MEDIA);

			await Promise.all(data.members.map(item => Xmpp.inviteUser(roomJid, toBareJid(item))));

			if (!isGroup) {
				await Xmpp.subscribeToPresence(data.members[0]);
			}

			// Add room to joined rooms
			setJoinedRooms(prev => [...prev, roomJid]);

			setActiveJid(roomJid);
			setSharedMediaOpen(undefined);

			await mutate([QUERY_KEYS.XMPP_BOOKMARKS, removeResourceFromJid(jid)]);

			setIsSubmitting(false);
			setIsCreating();
			setConversationCreating(false);
			onClose();
		} catch (error) {
			setIsSubmitting(false);
			setIsCreating();
			setConversationCreating(false);
			toast.error((error as Error).message, { theme: 'colored' });
		}
	};

	return conversationOpen ? (
		<Box
			sx={theme => ({
				width: '100%',
				background: theme.palette.dark[500],
				backdropFilter: 'blur(22px)',
				border: `1px solid ${theme.palette.dark[500]}`,
				borderRadius: theme.shape.borderRadius,
				display: 'flex',
				flexDirection: 'column',
				maxHeight: 'calc(100vh - 160px)'
			})}
		>
			<ChatHeader />
			<Form<ConversationFormData>
				action={handleOnFormSubmit}
				mode="onChange"
				defaultValues={{
					member: '',
					members: []
				}}
				myRef={formRef}
				schema={newConversationSchema}
			>
				<Members disabled={isSubmitting} />
			</Form>
		</Box>
	) : (
		<Dialog
			title="New Conversation"
			open={open}
			onClose={onClose}
			onConfirm={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			onConfirmText="Create"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<ConversationFormData>
				action={handleOnFormSubmit}
				mode="onChange"
				defaultValues={{
					member: '',
					members: []
				}}
				myRef={formRef}
				schema={newConversationSchema}
			>
				<Members disabled={isSubmitting} />
			</Form>
		</Dialog>
	);
};
