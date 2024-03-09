import { Box, Stack, Popover } from '@mui/material';
import { useState, useContext, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { Grid, SearchBar, SearchContext, SearchContextManager } from '@giphy/react-components';
import { useSetRecoilState } from 'recoil';
import { Icon } from 'src/components/Icon';
import { getAttachmentType, isValidFileSize } from 'src/helpers/file.helpers';
import { Paragraph3 } from 'src/components/Typography';
import { IconButton } from 'src/components/IconButton';
import { StandaloneInputField } from 'src/components/InputField';
import { GIPHY_API_KEY } from 'src/constants/api.constants';
import { IGNORE_BODY } from 'src/constants/xmpp.constants';

import { messageAttachmentsCountState } from 'src/recoil/messageAttachmentsCount';
import { toast } from 'react-toastify';
import { useDevice } from 'src/hooks/useDevice';
import { ChatContext } from 'src/contexts';
import { MAX_FILE_SIZE } from 'src/constants/constants';
import { useLocation } from 'react-router-dom';

export const MessageField = ({
	isDeactivated,
	onMessage
}: {
	isDeactivated: boolean;
	onMessage: (message: string, attachments: File[]) => Promise<void>;
}) => {
	const { chatOpen } = useContext(ChatContext);
	const { iMid, iSm } = useDevice();
	const { pathname } = useLocation();
	const fileRef = useRef<HTMLInputElement>(null);

	const [message, setMessage] = useState('');
	const [attachments, setAttachments] = useState<File[]>([]);
	const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [gifAnchorEl, setGifAnchorEl] = useState<HTMLButtonElement | null>(null);
	const isChat = pathname.includes('chat');

	const setMessageAttachmentsCount = useSetRecoilState(messageAttachmentsCountState);

	useEffect(() => {
		setMessageAttachmentsCount(attachments.length);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attachments]);

	const handleOnSendMessage = async () => {
		if (!message.trim().length && !attachments.length) {
			return;
		}

		setMessage('');
		setAttachments([]);

		// Hacky way to send attachments without a message (e.g. when sending a file)
		// Without a message we do not get the element 'archived' in the stanza which we need to get the name of the room
		// Bypass this by sending a message with the text 'IGNORE_BODY' together with the attachments
		await onMessage(message.length ? message : IGNORE_BODY, attachments);
	};

	const handleOnGifMessage = async (url: string) => {
		// Get file from url
		// const response = await fetch(url);
		// const blob = await response.blob();
		// const file = new File([blob], name, { type: blob.type });
		// console.log({ file });

		await onMessage(url, []);
	};

	const handleOnRemoveAttachment = (index: number) => {
		// Remove attachment from state
		setAttachments(attachments.filter((_, i) => i !== index));
	};

	return (
		<Box
			className="input-box"
			sx={theme => ({
				width: { xs: '100%', sm: 'auto' },
				position: { xs: 'fixed', sm: 'relative' },
				bottom: 0,
				left: 0,
				background: { xs: theme.palette.dark[500], sm: theme.palette.dark[700] },
				backdropFilter: { xs: 'blur(22px)', sm: 'none' },
				padding: isChat ? { xs: 2, sm: theme.spacing(0, 2, 2, 2) } : 0
			})}
		>
			{attachments.length ? (
				<Stack
					direction="row"
					spacing={1}
					sx={theme => ({
						p: 1,
						mb: 0.5,
						position: 'absolute',
						overflowX: 'auto',
						bottom: '100%',
						left: theme.spacing(2),
						width: `calc(100% - ${iSm ? '30px' : iMid ? '112px' : '120px'})`,
						backgroundColor: theme.palette.secondary[900],
						border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
						borderRadius: 1
					})}
				>
					{attachments.map((attachment, index) => (
						<MessageAttachment key={index} attachment={attachment} onRemove={() => handleOnRemoveAttachment(index)} />
					))}
				</Stack>
			) : null}
			{iSm && (
				<IconButton
					icon="attachFile"
					onClick={() => {
						// Open file dialog
						fileRef.current?.click();
					}}
				/>
			)}
			<StandaloneInputField
				value={message}
				onChange={e => setMessage(e.target.value)}
				name="message"
				placeholder="Type a message..."
				multiline
				maxMultilineRows={4}
				endElement={
					<IconButton
						icon="mood"
						onClick={e => setEmojiAnchorEl(e.currentTarget)}
						onMouseDown={e => e.preventDefault()}
					/>
				}
				onKeyPress={e => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						if (isDeactivated) {
							toast.warning('This user was deactivated!', { theme: 'colored' });
						} else {
							handleOnSendMessage();
						}
					}
				}}
			/>
			{!iSm && (
				<Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
					{!chatOpen && (
						<>
							<IconButton
								icon="image"
								onClick={() => {
									// Open file dialog
									fileRef.current?.click();
								}}
								onMouseDown={e => e.preventDefault()}
							/>
							<IconButton
								icon="gif"
								onClick={e => setGifAnchorEl(e.currentTarget)}
								onMouseDown={e => e.preventDefault()}
							/>
							<IconButton
								icon="attachFile"
								onClick={() => {
									// Open file dialog
									fileRef.current?.click();
								}}
								onMouseDown={e => e.preventDefault()}
							/>
						</>
					)}
				</Stack>
			)}
			<Popover
				id="emoji-popover"
				open={!!emojiAnchorEl}
				anchorEl={emojiAnchorEl}
				onClose={() => setEmojiAnchorEl(null)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
			>
				<EmojiPicker
					emojiStyle={EmojiStyle.TWITTER}
					onEmojiClick={emojiData => {
						setMessage(message + emojiData.emoji);
						setEmojiAnchorEl(null);
					}}
				/>
			</Popover>
			<Popover
				id="gif-popover"
				open={!!gifAnchorEl}
				anchorEl={gifAnchorEl}
				onClose={() => setGifAnchorEl(null)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
			>
				<Box
					sx={{
						p: 2,
						width: 400,
						height: 400
					}}
				>
					<SearchContextManager apiKey={GIPHY_API_KEY}>
						<GifComponents
							onGifClick={url => {
								handleOnGifMessage(url);
								setGifAnchorEl(null);
							}}
						/>
					</SearchContextManager>
				</Box>
			</Popover>
			<input
				hidden
				multiple
				type="file"
				accept="*"
				ref={fileRef}
				onChange={e => {
					// Add attachments to state, do not overwrite
					if (e.target.files) {
						const value = [...attachments, ...e.target.files];

						const isSizeValid = [...e.target.files].every(i => isValidFileSize(i, MAX_FILE_SIZE));
						e.target.value = '';

						if (value.length > 10) {
							toast.error('You cannot upload more than 10 files', { theme: 'colored' });
							return;
						} else if (!isSizeValid) {
							toast.error(`You cannot upload a file exceeding ${MAX_FILE_SIZE} MB`, { theme: 'colored' });
							return;
						}
						setAttachments(value);
					}
				}}
			/>
		</Box>
	);
};

const GifComponents = ({ onGifClick }: { onGifClick: (url: string, name: string) => void }) => {
	const { fetchGifs, searchKey } = useContext(SearchContext);

	return (
		<Stack
			direction="column"
			spacing={1}
			sx={{
				'& .giphy-search-bar': {
					div: {
						display: 'none'
					}
				},
				'& .giphy-gif:hover': {
					cursor: 'pointer'
				}
			}}
		>
			<SearchBar />
			{/** 
                key will recreate the component, 
                this is important for when you change fetchGifs 
                e.g. changing from search term dogs to cats or type gifs to stickers
                you want to restart the gifs from the beginning and changing a component's key does that 
            **/}
			<Grid
				hideAttribution
				layoutType="GRID"
				noLink
				onGifClick={gif => onGifClick(gif.images.original.url, gif.title)}
				key={searchKey}
				columns={2}
				width={400}
				fetchGifs={fetchGifs}
			/>
		</Stack>
	);
};

const MessageAttachment = ({ attachment, onRemove }: { attachment: File; onRemove: () => void }) => {
	return (
		<Stack
			direction="column"
			spacing={1}
			sx={{
				position: 'relative',
				p: 1,
				backgroundColor: theme => theme.palette.dark[500],
				borderRadius: '8px',
				width: 80
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					borderRadius: 'inherit'
				}}
			>
				{getAttachmentType(attachment) === 'image' ? (
					<img
						width={68}
						height={68}
						src={URL.createObjectURL(attachment)}
						alt={attachment.name}
						style={{ borderRadius: '8px' }}
					/>
				) : (
					<Icon
						icon="file"
						fontSize="large"
						sx={{
							fontSize: 68
						}}
					/>
				)}
			</Box>
			<Paragraph3 noWrap>{attachment.name}</Paragraph3>
			<Box
				sx={{
					position: 'absolute',
					right: -9,
					top: -16
				}}
			>
				<IconButton icon="close" onClick={onRemove} />
			</Box>
		</Stack>
	);
};
