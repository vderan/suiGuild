import { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Collapse } from '@mui/material';
import { toast } from 'react-toastify';
import pluralize from 'pluralize';
import { BackButton, OutlineButton } from 'src/components/Button';
import { IconButton } from 'src/components/IconButton';
import { H2Title, Paragraph2, CTitle, H1Title } from 'src/components/Typography';
import { useDevice } from 'src/hooks/useDevice';
import { useGilder } from 'src/hooks/useGilder';
import { AuthContext } from 'src/contexts';
import { CAvatar, LargeAvatar } from 'src/components/Avatar';
import { differenceDate } from 'src/helpers/date.helpers';
import { PrimaryEditor } from 'src/components/TextEditor';
import { Form } from 'src/components/Form';
import { createCommentSchema } from 'src/schemas/create-comment.schema';
import { InputField } from 'src/components/InputField';
import { PostIndividualSkeleton } from 'src/components/Skeleton/PostIndividualSkeleton';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import ShareBox from 'src/components/ShareBox';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { Comment } from 'src/components/Post';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { NotFound } from 'src/components/NotFound';
import { ErrorHandler } from 'src/helpers';

export const PostIndividualMain = () => {
	const { id } = useParams();
	const { iMid } = useDevice();
	const commentRef = useRef<null | HTMLFormElement>(null);
	const { profile, isLoggedIn } = useContext(AuthContext);
	const { getPosts, createComment, vote } = useGilder();
	const { data: posts, isLoading, error: isError } = useCustomSWR('getPosts', getPosts);
	const post = posts?.find(post => post.idx === id);
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
	const [isVoteSubmitting, setIsVoteSubmitting] = useState(false);

	const handleComments = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const addComment = async (forumId: number, postId: number, content: string) => {
		if (!profile?.displayName) {
			toast.warning('You should have your own display name!', { theme: 'colored' });
			return;
		}
		setIsCommentSubmitting(true);
		try {
			await createComment(forumId, postId, content);
			commentRef.current?.reset();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsCommentSubmitting(false);
	};

	const votePost = async (postId: number) => {
		if (!isLoggedIn) {
			toast.warning('You should login into platform!', { theme: 'colored' });
			return;
		}
		setIsVoteSubmitting(true);
		try {
			await vote(postId);
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsVoteSubmitting(false);
	};

	const Title = iMid ? H2Title : H1Title;

	const VoteAndShareBox = () => (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<OutlineButton
				startIcon="arrowUp"
				onClick={() => votePost(Number(post?.idx))}
				iconSize="small"
				loading={isVoteSubmitting}
			>
				{post?.vote} {pluralize('vote', post ? Number(post.vote) : 0)}
			</OutlineButton>
			<ShareBox
				label="Share"
				links={[
					{
						title: 'Copy URL',
						href: `${window.location.origin}/forum/postindividual/${post?.idx}`,
						icon: 'link'
					}
				]}
			/>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, lg: 3 } }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
				<BackButton>Back</BackButton>
				{iMid && post && <VoteAndShareBox />}
			</Box>

			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<PostIndividualSkeleton />
			) : post ? (
				<Box>
					<Title sx={{ wordBreak: 'break-word' }} title={post?.title}>
						{post?.title}
					</Title>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							justifyContent: 'space-between',
							mt: { xs: 1.5, lg: 2 }
						}}
					>
						{!iMid && <VoteAndShareBox />}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
							<Paragraph2 color="text.secondary" whiteSpace="nowrap">
								Posted by
							</Paragraph2>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
								<CAvatar address={post.creatorInfo} />
								<CTitle address={post.creatorInfo} />
							</Box>
							<Paragraph2 color="text.secondary" whiteSpace="nowrap">
								{differenceDate(Number(post.createdAt))}
							</Paragraph2>
						</Box>
					</Box>

					<Box
						sx={theme => ({
							mt: 3,
							padding: { xs: 2, lg: 4 },
							background: theme.palette.dark[700],
							borderRadius: 1.5
						})}
					>
						<PrimaryEditor readOnly readContent={post?.message} post={post} />
					</Box>
					<Box
						sx={theme => ({
							mt: 2,
							padding: { xs: 2, lg: 4 },
							background: theme.palette.dark[700],
							borderRadius: 1.5
						})}
					>
						<IconButton
							icon="message"
							size="extraSmall"
							onClick={handleComments}
							label={`${post.comments?.length} ${pluralize('comment', post.comments?.length)}`}
						/>
						<Collapse in={isShowExpandableSection}>
							<>
								{isLoggedIn && (
									<Box sx={{ mt: 3 }}>
										<Form
											action={data => addComment(Number(post?.communityIdx), Number(post?.idx), data.comment)}
											defaultValues={{
												comment: ''
											}}
											myRef={commentRef}
											schema={createCommentSchema}
										>
											<InputField
												type="text"
												name="comment"
												placeholder="Add comment..."
												multiline
												disabled={isCommentSubmitting}
												maxMultilineRows={4}
												isAdornmentCentered={false}
												startElement={<LargeAvatar image={ipfsUrl(profile?.avatar || avatarUrl)} />}
												endElement={
													<IconButton
														sx={{ mt: 0.625 }}
														loading={isCommentSubmitting}
														icon="send"
														onClick={() =>
															commentRef.current?.dispatchEvent(
																new Event('submit', { cancelable: true, bubbles: true })
															)
														}
													/>
												}
											/>
										</Form>
									</Box>
								)}
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
									{post.comments?.map(comment => (
										<Comment key={comment.idx} comment={comment} communityIdx={post.communityIdx} />
									))}
								</Box>
							</>
						</Collapse>
					</Box>
				</Box>
			) : (
				<NotFound description="Post not found" />
			)}
		</Box>
	);
};
