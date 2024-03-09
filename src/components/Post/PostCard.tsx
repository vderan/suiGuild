import { useState, useContext, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Collapse, Link, Skeleton, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import pluralize from 'pluralize';
import { CAvatar, LargeAvatar, SmallAvatar } from 'src/components/Avatar';
import { OutlineButton } from 'src/components/Button';
import { IconButton } from 'src/components/IconButton';
import { InputField } from 'src/components/InputField';
import { H4Title, Paragraph2, CTitle, Label } from 'src/components/Typography';
import { IPost, AuthContext } from 'src/contexts';
import { Comment } from './Comment';
import { Form } from 'src/components/Form';
import { PrimaryEditor } from 'src/components/TextEditor';
import { useGilder } from 'src/hooks/useGilder';
import { differenceDate } from 'src/helpers/date.helpers';
import { createCommentSchema } from 'src/schemas/create-comment.schema';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import ShareBox from 'src/components/ShareBox';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';
import { Dialog } from '../Dialog';

interface IPostCardProps {
	post: IPost;
	isShowForum?: boolean;
	isEditBtnShown?: boolean;
	openedCommentIndex?: string;
	onCommentToggle?: (index: string) => void;
}

export const PostCard = ({
	post,
	isShowForum = true,
	isEditBtnShown = false,
	openedCommentIndex,
	onCommentToggle
}: IPostCardProps) => {
	const commentRef = useRef<null | HTMLFormElement>(null);
	const { profile, isLoggedIn } = useContext(AuthContext);
	const { getAllCommunities } = useGilder();
	const { data: forums, isLoading } = useCustomSWR('getAllCommunities', getAllCommunities);
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const [isVoteSubmitting, setIsVoteSubmitting] = useState(false);
	const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
	const [isEditPostModalShown, setIsEditPostModalShown] = useState(false);

	const { iMd } = useDevice();

	const forum = forums?.find(forum => forum.idx === post.communityIdx);
	const { createComment, vote } = useGilder();

	const handleComments = () => {
		onCommentToggle?.(isShowExpandableSection ? '' : post.idx);
	};

	useEffect(() => {
		setIsShowExpandableSection(openedCommentIndex === post.idx);
	}, [openedCommentIndex, post.idx]);

	const ForumAvatar = iMd ? LargeAvatar : SmallAvatar;

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

	return (
		<Box
			sx={theme => ({
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				padding: theme.spacing(4),
				background: theme.palette.dark[700],
				borderRadius: 1.5
			})}
		>
			<Box
				sx={theme => ({
					display: 'grid',
					justifyContent: 'space-between',
					gap: 2,
					alignItems: 'center',
					marginBottom: { xs: 2, md: 3 },
					gridTemplateColumns: 'minmax(20px, auto) minmax(100px, auto)',
					[theme.breakpoints.down('md')]: {
						gridTemplateColumns: 'minmax(100px, 1fr)'
					}
				})}
			>
				<Box
					sx={theme => ({
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						[theme.breakpoints.down('md')]: {
							justifyContent: 'space-between'
						}
					})}
				>
					<OutlineButton startIcon="arrowUp" onClick={() => votePost(Number(post.idx))} loading={isVoteSubmitting}>
						{post.vote} {pluralize('vote', Number(post.vote))}
					</OutlineButton>
					{isShowForum &&
						(isLoading ? (
							<Stack direction="row" alignItems="center" spacing={1}>
								<Skeleton variant="circular" height={iMd ? 32 : 20} width={iMd ? 32 : 20} />
								<Skeleton variant="text" height={20} width={100} />
							</Stack>
						) : (
							<Box display="flex" gap={2} overflow="hidden">
								<Link
									component={NavLink}
									to={`/forum/communityindividual/${post.communityIdx}`}
									sx={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 1 }}
								>
									<ForumAvatar image={ipfsUrl(forum?.avatar.some.url || avatarUrl)} />
									<Label noWrap>{forum?.title}</Label>
								</Link>
								{iMd && isEditBtnShown && <IconButton icon="edit" onClick={() => setIsEditPostModalShown(true)} />}
							</Box>
						))}
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
					<Paragraph2 color="text.secondary" whiteSpace="nowrap">
						Posted by
					</Paragraph2>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
						<CAvatar address={post.creatorInfo} />
						<CTitle address={post.creatorInfo} />
					</Box>
					<Paragraph2
						whiteSpace="nowrap"
						color="text.secondary"
						sx={theme => ({
							[theme.breakpoints.down('md')]: {
								marginLeft: 'auto'
							}
						})}
					>
						{differenceDate(Number(post.createdAt))}
					</Paragraph2>
					{!iMd && isEditBtnShown && <IconButton icon="edit" onClick={() => setIsEditPostModalShown(true)} />}
				</Box>
			</Box>
			<Link component={NavLink} to={`/forum/postindividual/${post.idx}`}>
				<H4Title sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} title={post.title}>
					{post.title}
				</H4Title>

				<PrimaryEditor readOnly readContent={post.message} post={post} />
			</Link>

			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5 }}>
				<IconButton
					icon="message"
					size="extraSmall"
					onClick={handleComments}
					label={`${post.comments?.length} ${pluralize('comment', post.comments?.length)}`}
				/>

				<ShareBox
					label="Share"
					links={[
						{
							title: 'Copy URL',
							href: `${window.location.origin}/forum/postindividual/${post.idx}`,
							icon: 'link'
						}
					]}
				/>
			</Box>

			<Collapse in={isShowExpandableSection}>
				<>
					{isLoggedIn && (
						<Box sx={{ mt: 3 }}>
							<Form
								action={data => addComment(Number(post.communityIdx), Number(post.idx), data.comment)}
								defaultValues={{
									comment: ''
								}}
								myRef={commentRef}
								schema={createCommentSchema}
							>
								<InputField
									type="text"
									name="comment"
									multiline
									maxMultilineRows={4}
									disabled={isCommentSubmitting}
									placeholder="Add comment..."
									isAdornmentCentered={false}
									startElement={<LargeAvatar image={ipfsUrl(profile?.avatar || avatarUrl)} />}
									endElement={
										<IconButton
											sx={{ mt: 0.625 }}
											icon="send"
											loading={isCommentSubmitting}
											onClick={() =>
												commentRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
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

			<Dialog title="Edit post" nofooter open={isEditPostModalShown} onClose={() => setIsEditPostModalShown(false)}>
				<PrimaryEditor
					title={post.title}
					content={post.message}
					post={post}
					communityIndex={Number(post.communityIdx)}
					isSaveDraftBtnShown={false}
					onClose={() => setIsEditPostModalShown(false)}
				/>
			</Dialog>
		</Box>
	);
};
