import { NavLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import pluralize from 'pluralize';
import { H4Title, Paragraph2, CTitle, Paragraph3 } from 'src/components/Typography';
import { Icon } from 'src/components/Icon';
import { IPost } from 'src/contexts';
import { PrimaryEditor } from 'src/components/TextEditor';
import { differenceDate } from 'src/helpers/date.helpers';
import { CAvatar, LargeAvatar } from 'src/components/Avatar';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';

export const PostCardSmall = ({ post }: { post: IPost }) => {
	const { getAllCommunities } = useGilder();
	const { data: forums } = useCustomSWR('getAllCommunities', getAllCommunities);
	const forum = forums?.find(forum => forum.idx === post.communityIdx);

	return (
		<Box
			sx={{
				gap: 1,
				display: 'flex',
				flexDirection: 'column',
				pb: 2.5,
				borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
			}}
		>
			<Box sx={{ gap: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Link
					component={NavLink}
					to={`/forum/communityindividual/${forum?.idx}`}
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<LargeAvatar image={ipfsUrl(forum?.avatar.some.url || avatarUrl)} />
				</Link>
				<Box sx={{ gap: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
					<Paragraph2 color="text.secondary" whiteSpace="nowrap">
						By
					</Paragraph2>
					<Box sx={{ gap: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
						<CAvatar address={post?.creatorInfo} />
						<CTitle address={post?.creatorInfo} />
					</Box>
					<Paragraph2 color="text.secondary" whiteSpace="nowrap">
						{differenceDate(Number(post.createdAt))}
					</Paragraph2>
				</Box>
			</Box>
			<Link
				component={NavLink}
				to={`/forum/postindividual/${post.idx}`}
				sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}
			>
				<H4Title noWrap title={post.title}>
					{post.title}
				</H4Title>
				<PrimaryEditor readOnly readContent={post.message} numberLinesToDisplay={2} post={post} />
				<Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
					<Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
						<Icon icon="arrowUp" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
						<Paragraph3 color="text.secondary">
							{post.vote} {pluralize('vote', Number(post.vote))}
						</Paragraph3>
					</Box>
					<Paragraph2>·</Paragraph2>
					<Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
						<Icon icon="message" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
						<Paragraph3 color="text.secondary">
							{post.comments?.length} {pluralize('comment', post.comments?.length)}
						</Paragraph3>
					</Box>
				</Box>
			</Link>
		</Box>
	);
};
