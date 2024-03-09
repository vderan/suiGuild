import { Stack, Typography, useTheme, Box, Link } from '@mui/material';
import { Image } from 'mui-image';
import {
	containsURL,
	getMessageTimestamp,
	getUsernameFromJid,
	highlightMessage,
	isGifUrl,
	isOnlyEmoji,
	replaceURLsWithAnchors
} from 'src/helpers/xmpp.helpers';
import React, { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { useRecoilValue } from 'recoil';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { formatBytes } from 'src/helpers/format.helpers';
import { Message as IMessage, MessageAttachment } from 'src/types/Xmpp.types';
import { MediumAvatar } from 'src/components/Avatar';
import { PreTitle, Paragraph2 } from 'src/components/Typography';
import isURL from 'validator/lib/isURL';
import { chatSearchState } from 'src/recoil/chatSearch';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { Icon } from 'src/components/Icon';

export const Message = React.memo(
	({ message }: { message: IMessage; previousMessage?: IMessage }) => {
		const { getUserByName } = useProfile();
		const search = useRecoilValue(chatSearchState);
		const [isGif, setIsGif] = useState(false);
		const sender = getUsernameFromJid(message.sender);
		const { data: user } = useCustomSWR('getUserByName' + sender, () => getUserByName(sender));
		const userAvatar = user?.userInfo.some?.avatar.url || '';

		useEffect(() => {
			const init = async () => {
				if (isURL(message.message)) {
					const isGif = await isGifUrl(message);
					setIsGif(isGif);
				}
			};

			init();
		}, [message]);

		const formattedMessage = useMemo(() => {
			let msg = message.message;

			if (containsURL(message)) {
				msg = replaceURLsWithAnchors(msg);
			}

			msg = highlightMessage(search, msg);

			return msg;
		}, [message, search]);

		return (
			<Box className="chat-box">
				<Box className="userInfo">
					<MediumAvatar image={userAvatar ? ipfsUrl(userAvatar) : ''}>
						{getUsernameFromJid(message.sender).charAt(0).toUpperCase()}
					</MediumAvatar>
					<PreTitle noWrap>{getUsernameFromJid(message.sender)}</PreTitle>
					<Paragraph2 noWrap>{getMessageTimestamp(message.date)}</Paragraph2>
				</Box>
				<Box className="chatDetail">
					{
						// If its a GIF only show the GIF
						isGif ? (
							<GiphyAttachment giphy={message.message} />
						) : message.message.length ? (
							// Show the message
							<Box
								sx={{
									display: 'inline-block',
									alignItems: 'center',
									fontSize: isOnlyEmoji(message) ? 40 : 14,
									maxWidth: '100%',
									wordBreak: 'break-word',
									whiteSpace: 'pre-wrap',
									fontFamily: 'Exo'
								}}
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(formattedMessage, { ADD_ATTR: ['target'] })
								}}
							/>
						) : null
					}
					{message.attachments.length ? (
						<Stack maxWidth="100%" direction="row" spacing={1}>
							{message.attachments.map((attachment, index) => (
								<React.Fragment key={attachment.url + index}>
									{attachment.type === 'image' && <ImageAttachment {...attachment} />}
									{attachment.type === 'audio' && <AudioAttachment {...attachment} />}
									{attachment.type === 'video' && <VideoAttachment {...attachment} />}
									{attachment.type === 'file' && <FileAttachment {...attachment} />}
								</React.Fragment>
							))}
						</Stack>
					) : null}
				</Box>
			</Box>
		);
	},
	(prev, next) => prev.message.message === next.message.message
);

const GiphyAttachment = ({ giphy }: { giphy: string }) => {
	const theme = useTheme();

	return (
		<Link
			sx={{
				cursor: 'pointer'
			}}
			href={giphy}
			target="_blank"
		>
			<Image
				alt="GIF"
				src={giphy}
				fit="cover"
				duration={0}
				easing="unset"
				height={200}
				width={200}
				bgColor="transparent"
				style={{
					borderRadius: `${theme.shape.borderRadius}px`
				}}
			/>
		</Link>
	);
};

const ImageAttachment = (image: MessageAttachment) => {
	const theme = useTheme();

	return (
		<Link
			sx={{
				cursor: 'pointer'
			}}
			href={ipfsUrl(image.url)}
			target="_blank"
		>
			<Image
				alt={image.name}
				src={ipfsUrl(image.url)}
				fit="fill"
				duration={0}
				easing="unset"
				height={200}
				width={200}
				bgColor="transparent"
				style={{
					borderRadius: `${theme.shape.borderRadius}px`
				}}
			/>
		</Link>
	);
};

export const AudioAttachment = (audio: MessageAttachment) => {
	return (
		<Stack
			direction="column"
			justifyItems="flex-start"
			alignItems="flex-start"
			spacing={1}
			sx={{
				p: 1,
				backgroundColor: theme => theme.palette.secondary[900],
				borderRadius: theme => `${theme.shape.borderRadius}px`
			}}
		>
			<Stack direction="row" spacing={1} alignItems="center">
				<Icon icon="file" />
				<Stack direction="column">
					<Box
						component="a"
						download
						href={ipfsUrl(audio.url)}
						target="_blank"
						sx={{
							height: 20,
							textDecoration: 'none',
							color: 'inherit',
							'&:hover': {
								textDecoration: 'underline'
							}
						}}
					>
						<Typography variant="caption" color="text.primary">
							{audio.name}
						</Typography>
					</Box>
					<Typography variant="caption" color="text.secondary">
						{formatBytes(audio.size)}
					</Typography>
				</Stack>
			</Stack>
			<audio controls>
				<source src={ipfsUrl(audio.url)} type={audio.mimeType} />
			</audio>
		</Stack>
	);
};

export const VideoAttachment = (video: MessageAttachment) => {
	return (
		<video controls>
			<source src={ipfsUrl(video.url)} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
};

export const FileAttachment = (file: MessageAttachment) => {
	return (
		<Box
			sx={{
				p: 1,
				backgroundColor: theme => theme.palette.secondary[900],
				color: 'inherit',
				textDecoration: 'none',
				borderRadius: theme => `${theme.shape.borderRadius}px`,
				minWidth: 316
			}}
		>
			<Stack direction="row" spacing={1} alignItems="center">
				<Icon icon="file" />
				<Stack direction="column">
					<Box
						component="a"
						download
						href={ipfsUrl(file.url)}
						target="_blank"
						sx={{
							height: 20,
							textDecoration: 'none',
							color: 'inherit',
							'&:hover': {
								textDecoration: 'underline'
							}
						}}
					>
						<Typography variant="caption" color="text.primary">
							{file.name}
						</Typography>
					</Box>
					<Typography variant="caption" color="text.secondary">
						{formatBytes(file.size)}
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
};
