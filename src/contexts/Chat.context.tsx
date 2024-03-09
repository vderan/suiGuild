import { createContext, useContext, useEffect } from 'react';
import { PropsWithChildren, useState } from 'react';
import { Message, MessageType } from 'src/types/Xmpp.types';
import { AuthContext } from './Auth.context';
import { getUsernameFromJid } from 'src/helpers/xmpp.helpers';
import { Xmpp } from 'src/api/xmpp';
import { useSWRConfig } from 'swr';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { useDevice } from 'src/hooks/useDevice';
import { useLocation } from 'react-router-dom';

interface IChatContext {
	activeJid: string;
	setActiveJid: (jid: string) => void;

	messages: Record<string, Message[]>;
	addMessage: (message: Message, jid: string, type: MessageType) => Promise<void>;
	addHistory: (messages: Message, roomJid: string) => void;
	setMessages: (messages: Record<string, Message[]>) => void;

	historyComplete: Record<string, boolean>;
	setHistoryComplete: (jid: string, loaded: boolean) => void;

	chatOpen: boolean;
	setChatOpen: (open: boolean) => void;

	infoOpen: boolean;
	setInfoOpen: (open: boolean) => void;

	conversationOpen: boolean;
	setConversationOpen: (open: boolean) => void;

	conversationCreating: boolean;
	setConversationCreating: (open: boolean) => void;

	sideBarOpen: boolean;
	setSideBarOpen: (open: boolean) => void;

	isMobileChat: boolean;
}

export const ChatContext = createContext<IChatContext>({
	activeJid: '',
	setActiveJid: () => {},

	messages: {},
	addMessage: () => Promise.resolve(),
	addHistory: () => {},
	setMessages: () => {},

	historyComplete: {},
	setHistoryComplete: () => {},

	chatOpen: false,
	setChatOpen: () => {},

	infoOpen: false,
	setInfoOpen: () => {},

	conversationOpen: false,
	setConversationOpen: () => {},

	conversationCreating: false,
	setConversationCreating: () => {},

	sideBarOpen: false,
	setSideBarOpen: () => {},

	isMobileChat: false
});

export const ChatProvider = ({ children }: PropsWithChildren) => {
	const { jid, profile } = useContext(AuthContext);
	const { mutate } = useSWRConfig();
	const { iMid } = useDevice();
	const { pathname } = useLocation();

	const [messages, setMessages] = useState<Record<string, Message[]>>({});
	const [historyComplete, setHistoryComplete] = useState<Record<string, boolean>>({});
	const [activeJid, setActiveJid] = useState<string>('');
	const [chatOpen, setChatOpen] = useState<boolean>(false);
	const [infoOpen, setInfoOpen] = useState<boolean>(false);
	const [conversationOpen, setConversationOpen] = useState<boolean>(false);
	const [conversationCreating, setConversationCreating] = useState<boolean>(false);
	const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

	const isChat = pathname.includes('chat');
	const isMobileChat = iMid && isChat;

	useEffect(() => {
		if (!profile?.id) {
			setActiveJid('');
			setHistoryComplete({});
			setMessages({});
			setChatOpen(false);
			setInfoOpen(false);
			setConversationOpen(false);
			setSideBarOpen(false);
		}
	}, [profile?.id]);

	const handleOnAddMessage = async (message: Message, roomJid: string, type: MessageType) => {
		setMessages(prevState => ({
			...prevState,
			[roomJid]: [message, ...(prevState[roomJid] ?? [])]
		}));

		// Do not add shared media for MAM (history) messages
		if (type === 'message') {
			// Add shared media only if the message is from the current user to prevent duplicates
			if (jid && getUsernameFromJid(jid) === getUsernameFromJid(message.sender)) {
				await Xmpp.addSharedMedia(roomJid, message);
			}

			await mutate([QUERY_KEYS.XMPP_SHARED_MEDIA, roomJid]);
		}
	};

	const handleOnSetHistoryComplete = (jid: string, loaded: boolean) => {
		setHistoryComplete(prevState => ({
			...prevState,
			[jid]: loaded
		}));
	};

	const handleOnAddHistory = (message: Message, roomJId: string) => {
		// We need to add the history message in the end of the array because we are using
		// an InfiniteScroll component that is inverted, so when we scroll up we see the older messages
		setMessages(prevState => ({
			...prevState,
			[roomJId]: [...(prevState[roomJId] ?? []), message]
		}));
	};

	return (
		<>
			<ChatContext.Provider
				value={{
					activeJid,
					setActiveJid,

					messages,
					addMessage: handleOnAddMessage,
					addHistory: handleOnAddHistory,
					setMessages: setMessages,

					historyComplete,
					setHistoryComplete: handleOnSetHistoryComplete,

					chatOpen,
					setChatOpen,

					infoOpen,
					setInfoOpen,

					conversationOpen,
					setConversationOpen,

					conversationCreating,
					setConversationCreating,

					sideBarOpen,
					setSideBarOpen,

					isMobileChat
				}}
			>
				{children}
			</ChatContext.Provider>
		</>
	);
};
