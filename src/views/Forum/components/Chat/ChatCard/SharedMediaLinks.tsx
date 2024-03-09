import { Box, Link, Stack } from '@mui/material';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { H3Title, PreTitle } from 'src/components/Typography';
import { ChatContext } from 'src/contexts';
import { getUrlFromText } from 'src/helpers/xmpp.helpers';
import { useRoomSharedMedia } from 'src/hooks/useRoomSharedMedia';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { useSetRecoilState } from 'recoil';

export const SharedMediaLinks = () => {
	const { activeJid } = useContext(ChatContext);
	const { links } = useRoomSharedMedia(activeJid);
	const { pathname } = useLocation();
	const isChat = pathname.includes('chat');

	const setSharedMediaOpen = useSetRecoilState(sharedMediaOpenState);

	return (
		<Box
			sx={{
				m: 2
			}}
		>
			<Stack direction="column" spacing={2}>
				<IconButton
					icon="arrowLeft"
					sx={{
						maxWidth: 5
					}}
					onClick={() => setSharedMediaOpen(undefined)}
				/>
				<H3Title>Shared links</H3Title>
				<Stack
					direction="column"
					spacing={2}
					sx={{
						minHeight: isChat ? 'calc(100vh - 360px)' : '238px',
						maxHeight: isChat ? 'calc(100vh - 360px)' : '238px',
						overflowY: 'auto',
						paddingRight: theme => theme.spacing(0.5)
					}}
				>
					{links.map(link => (
						<Link
							key={link.id}
							href={getUrlFromText(link.src)}
							target="_blank"
							sx={{
								display: 'flex',
								alignItems: 'center',
								textDecoration: 'none',
								gap: 2,
								p: 1.5,
								backgroundColor: theme => theme.palette.secondary[900],
								borderRadius: theme => `${theme.shape.borderRadius}px`
							}}
						>
							<Icon icon="link" />
							<PreTitle>{link.src}</PreTitle>
						</Link>
					))}
				</Stack>
			</Stack>
		</Box>
	);
};
