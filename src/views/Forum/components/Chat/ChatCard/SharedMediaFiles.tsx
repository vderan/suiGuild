import { Box, Grid, Link, Stack } from '@mui/material';
import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog } from 'src/components/Dialog';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { H3Title, Paragraph3, Label } from 'src/components/Typography';
import { ChatContext } from 'src/contexts';
import { formatBytes } from 'src/helpers/format.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getUsernameFromJid } from 'src/helpers/xmpp.helpers';
import { useRoomSharedMedia } from 'src/hooks/useRoomSharedMedia';
import { SharedMedia } from 'src/types/Xmpp.types';
import { sharedMediaOpenState } from 'src/recoil/sharedMediaOpen.atom';
import { useSetRecoilState } from 'recoil';

export const SharedMediaFiles = () => {
	const { activeJid } = useContext(ChatContext);
	const { files } = useRoomSharedMedia(activeJid);
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<SharedMedia | null>(null);
	const isChat = pathname.includes('chat');

	const setSharedMediaOpen = useSetRecoilState(sharedMediaOpenState);

	return (
		<Box
			sx={{
				p: 2
			}}
		>
			<Stack direction="column">
				<IconButton
					icon="arrowLeft"
					sx={{
						maxWidth: 5
					}}
					onClick={() => setSharedMediaOpen(undefined)}
				/>
				<H3Title
					sx={{
						mb: 2
					}}
				>
					Shared files
				</H3Title>
				<Box
					sx={{
						minHeight: isChat ? 'calc(100vh - 330px)' : '238px',
						maxHeight: isChat ? 'calc(100vh - 330px)' : '238px',
						overflowY: 'auto',
						paddingRight: theme => theme.spacing(0.5)
					}}
				>
					<Grid container spacing={2}>
						{files.map((file, index) => (
							<Grid item xs={12} sm={isChat ? 6 : 12} key={file.id + index}>
								<Link
									href={file.isGiphy ? file.src : ipfsUrl(file.src)}
									target="_blank"
									sx={{
										textDecoration: 'none',
										position: 'relative'
									}}
								>
									<SharedMediaCard file={file} />
									<IconButton
										icon="close"
										sx={{ position: 'absolute', right: 0, top: 0 }}
										onClick={e => {
											e.preventDefault();
											setSelectedFile(file);
											setOpen(true);
										}}
									/>
								</Link>
							</Grid>
						))}
					</Grid>
				</Box>
			</Stack>
			<Dialog
				width="dialogExtraSmall"
				open={open}
				title="Are you sure you want to delete this file?"
				isConfirmation
				onClose={() => setOpen(false)}
				onConfirm={() => setOpen(false)}
				onConfirmText="Yes, Delete"
				onCancelText="Cancel"
			>
				{selectedFile && <SharedMediaCard file={selectedFile} />}
			</Dialog>
		</Box>
	);
};

const SharedMediaCard = ({ file }: { file: SharedMedia }) => {
	return (
		<Stack
			spacing={1}
			direction="row"
			alignItems="center"
			sx={{
				p: 1.5,
				backgroundColor: theme => theme.palette.dark[500],
				borderRadius: 1
			}}
		>
			<Box
				sx={theme => ({
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: theme.spacing(8.5),
					minWidth: theme.spacing(8.5),
					height: theme.spacing(8.5),
					borderRadius: 1,
					background: theme => theme.palette.text.secondary
				})}
			>
				{file.type === 'image' ? (
					<img
						width={68}
						height={68}
						src={file.isGiphy ? file.src : ipfsUrl(file.src)}
						alt={file.name}
						style={{ borderRadius: 'inherit', objectFit: 'cover' }}
					/>
				) : (
					<Icon icon="file" fontSize="extraLarge" sx={{ color: theme => theme.palette.primary[900] }} />
				)}
			</Box>
			<Stack direction="column" spacing={0.5} overflow="hidden">
				<Label noWrap>{file.name}</Label>
				<Paragraph3 noWrap color="text.secondary">
					{formatBytes(file.size)} - Shared by {getUsernameFromJid(file.sender ?? '')}
				</Paragraph3>
			</Stack>
		</Stack>
	);
};
