import { useContext, useRef, useState } from 'react';
import { Box, ButtonBase, Collapse } from '@mui/material';
import { toast } from 'react-toastify';
import { AuthContext, IReplyProps } from 'src/contexts';
import { Paragraph2, Paragraph3 } from 'src/components/Typography';
import { differenceDate } from 'src/helpers/date.helpers';
import { InputField } from 'src/components/InputField';
import { createReplySchema } from 'src/schemas/create-reply.schema';
import { Form } from 'src/components/Form';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { CAvatar, LargeAvatar } from 'src/components/Avatar';
import { CTitle } from 'src/components/Typography';
import { IconButton } from 'src/components/IconButton';
import { ReadMore } from 'src/components/ReadMore';
import pluralize from 'pluralize';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { ErrorHandler } from 'src/helpers';
import { useDevice } from 'src/hooks/useDevice';

export const Reply = ({ depth, comment, communityIdx, reply }: IReplyProps) => {
	const { profile, isLoggedIn } = useContext(AuthContext);
	const replyToReplyRef = useRef<null | HTMLFormElement>(null);
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const [isReplySubmitting, setIsReplySubmitting] = useState(false);
	const { createReply } = useGilder();
	const { getUserInfo } = useProfile();
	const { data: user } = useCustomSWR('getUserInfo' + reply.creatorInfo, () => getUserInfo(reply.creatorInfo));
	const { iMd } = useDevice();

	const limit = depth + 1;

	const replies = comment.reply.filter(newReply => newReply.parentIdx === reply.threadIdx);

	const handleReplyShown = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const isCanAddReply = limit < 10;
	const isReplyingShown = !iMd && isShowExpandableSection && isLoggedIn;

	const addReplyToReply = async (content: string) => {
		if (!profile?.displayName) {
			toast.warning('You should have your own display name!', { theme: 'colored' });
			return;
		}
		setIsReplySubmitting(true);
		try {
			await createReply(
				Number(communityIdx),
				Number(comment.postIdx),
				Number(comment.idx),
				Number(reply.threadIdx),
				content
			);
			replyToReplyRef.current?.reset();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsReplySubmitting(false);
	};

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					padding: 1.5,
					gap: 1.5
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<CAvatar address={reply.creatorInfo} />
							<CTitle address={reply.creatorInfo} />
						</Box>
						<Paragraph3 color="text.secondary">{differenceDate(Number(reply?.createdAt))}</Paragraph3>
					</Box>
					<ReadMore>
						<Paragraph2 sx={{ wordBreak: 'break-word' }}>{reply?.message}</Paragraph2>
					</ReadMore>
				</Box>
				{isCanAddReply && (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, width: '100%' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
							<ButtonBase onClick={handleReplyShown} sx={{ overflow: 'hidden' }}>
								<Paragraph3 whiteSpace="nowrap">{isReplyingShown ? 'Replying to' : 'Reply'}</Paragraph3>
								{isReplyingShown && (
									<Paragraph3 noWrap ml={0.5} color="text.secondary">
										{user?.userInfo.some?.displayName}
									</Paragraph3>
								)}
							</ButtonBase>
							<Paragraph3 whiteSpace="nowrap" color="text.secondary">
								{replies.length} {pluralize('reply', replies.length)}
							</Paragraph3>
						</Box>
						{isReplyingShown && (
							<ButtonBase onClick={handleReplyShown}>
								<Paragraph3 color="text.secondary">Cancel</Paragraph3>
							</ButtonBase>
						)}
					</Box>
				)}
			</Box>
			{isCanAddReply && (
				<Collapse sx={{ width: '100%' }} in={isShowExpandableSection}>
					<>
						<Box sx={{ ml: 1.5 }}>
							<Form
								action={data => addReplyToReply(data.reply)}
								defaultValues={{
									reply: ''
								}}
								myRef={replyToReplyRef}
								schema={createReplySchema}
							>
								{profile && (
									<InputField
										type="text"
										name="reply"
										placeholder="Add reply..."
										multiline
										disabled={isReplySubmitting}
										maxMultilineRows={4}
										isAdornmentCentered={false}
										startElement={<LargeAvatar image={ipfsUrl(profile.avatar || avatarUrl)} />}
										endElement={
											<IconButton
												sx={{ mt: 0.625 }}
												icon="send"
												loading={isReplySubmitting}
												onClick={() =>
													replyToReplyRef.current?.dispatchEvent(
														new Event('submit', { cancelable: true, bubbles: true })
													)
												}
											/>
										}
									/>
								)}
							</Form>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: { xs: 2, md: 3 } }}>
							{replies.map(reply => (
								<Reply
									depth={limit}
									key={reply.parentIdx + reply.threadIdx}
									reply={reply}
									comment={comment}
									communityIdx={communityIdx}
								/>
							))}
						</Box>
					</>
				</Collapse>
			)}
		</Box>
	);
};
