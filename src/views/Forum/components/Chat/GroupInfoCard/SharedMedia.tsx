import { Box, ButtonBase } from '@mui/material';
import pluralize from 'pluralize';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Icon } from 'src/components/Icon';
import { PreTitle, Paragraph3 } from 'src/components/Typography';
import { ChatContext } from 'src/contexts';
import { useDevice } from 'src/hooks/useDevice';
import { useRoomSharedMedia } from 'src/hooks/useRoomSharedMedia';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';

export const SharedMedia = ({ onClose }: { onClose: () => void }) => {
	const { activeJid, setInfoOpen } = useContext(ChatContext);
	const { files, links } = useRoomSharedMedia(activeJid);
	const { iMid } = useDevice();
	const { pathname } = useLocation();

	const [sharedMediaOpen, setSharedMediaOpen] = useRecoilState(sharedMediaOpenState);

	const isChat = pathname.includes('chat');

	return (
		<Box className="content-box">
			<Paragraph3> Shared media</Paragraph3>
			<ButtonBase
				onClick={() => {
					if (sharedMediaOpen === 'links') {
						setSharedMediaOpen(undefined);
					} else {
						setSharedMediaOpen('links');
					}
					if (iMid || !isChat) {
						setInfoOpen(false);
						onClose();
					}
				}}
				className="inline-box"
				sx={{
					display: 'flex',
					justifyContent: 'flex-start',
					borderRadius: theme => `${theme.shape.borderRadius}px`
				}}
			>
				<Icon spacingRight icon="link" color={sharedMediaOpen === 'links' ? 'primary' : undefined} />
				<PreTitle color={sharedMediaOpen === 'links' ? 'primary' : undefined}>
					{links.length}&nbsp;&nbsp;shared {pluralize('link', links.length)}
				</PreTitle>
			</ButtonBase>
			<ButtonBase
				onClick={() => {
					if (sharedMediaOpen === 'files') {
						setSharedMediaOpen(undefined);
					} else {
						setSharedMediaOpen('files');
					}
					if (iMid || !isChat) {
						setInfoOpen(false);
						onClose();
					}
				}}
				className="inline-box"
				sx={{
					display: 'flex',
					justifyContent: 'flex-start',
					borderRadius: theme => `${theme.shape.borderRadius}px`
				}}
			>
				<Icon spacingRight icon="image" color={sharedMediaOpen === 'files' ? 'primary' : undefined} />
				<PreTitle color={sharedMediaOpen === 'files' ? 'primary' : undefined}>
					{files.length}&nbsp;&nbsp;{pluralize('file', files.length)}
				</PreTitle>
			</ButtonBase>
		</Box>
	);
};
