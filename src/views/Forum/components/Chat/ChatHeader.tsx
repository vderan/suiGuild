import { Stack } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from 'src/components/Button';
import { IconButton } from 'src/components/IconButton';
import { H4Title } from 'src/components/Typography';
import { ChatContext } from 'src/contexts';

export const ChatHeader = ({ title }: { title?: string | undefined }) => {
	const {
		chatOpen,
		setChatOpen,
		activeJid,
		setActiveJid,
		infoOpen,
		setInfoOpen,
		conversationOpen,
		setConversationOpen
	} = useContext(ChatContext);

	const navigate = useNavigate();

	const handleArrowBack = () => {
		if (infoOpen) {
			setInfoOpen(false);
		} else {
			setActiveJid('');
		}
	};

	return (
		<Stack
			width="100%"
			direction="row"
			justifyContent="space-between"
			alignItems="center"
			overflow="hidden"
			padding={1}
		>
			{chatOpen && activeJid ? (
				<Stack width="calc(100% - 80px)" direction="row" alignItems="center" gap={1}>
					<IconButton icon="chevronLeft" onClick={handleArrowBack} />
					<H4Title noWrap>{title}</H4Title>
				</Stack>
			) : conversationOpen ? (
				<Stack direction="row" alignItems="center" gap={1}>
					<IconButton icon="chevronLeft" onClick={() => setConversationOpen(false)} />
					<H4Title>New conversation</H4Title>
				</Stack>
			) : (
				<Stack direction="row" alignItems="center" gap={1}>
					<IconButton
						icon="message"
						onClick={() => {
							navigate('/chat');
							setChatOpen(false);
						}}
					/>
					<H4Title>Chat</H4Title>
				</Stack>
			)}

			<Stack direction="row" gap={1}>
				{chatOpen && activeJid && <IconButton icon="sidebar" onClick={() => setInfoOpen(!infoOpen)} />}
				<SecondaryButton size="small" startIcon="close" onClick={() => setChatOpen(false)} />
			</Stack>
		</Stack>
	);
};
