import { Box, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { CAvatar, MediumAvatar } from 'src/components/Avatar';
import { Icon } from 'src/components/Icon';
import { H4Title, Paragraph2 } from 'src/components/Typography';
import { AuthContext, IForum } from 'src/contexts';
import pluralize from 'pluralize';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useContext, useState } from 'react';
import { QuaternaryButton } from 'src/components/Button';
import { toast } from 'react-toastify';
import { useGilder } from 'src/hooks/useGilder';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';

export const CommunityCard = ({ forum }: { forum: IForum }) => {
	const { follow, unfollow } = useGilder();
	const { profile, loadUserInfo } = useContext(AuthContext);
	const isFollowing = forum.followers.some(follower => `0x${follower}` === profile?.id);
	const { iSm } = useDevice();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (profile?.id === `0x${forum.creatorInfo}` && isFollowing) {
			toast.warning("You can't leave your own community!", { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			const idx = Number(forum.idx);
			isFollowing ? await unfollow(idx) : await follow(idx);
			await loadUserInfo();
		} catch (e) {
			ErrorHandler.process(e);
		}
		setIsSubmitting(false);
	};

	return (
		<Box
			sx={theme => ({
				display: 'flex',
				justifyContent: 'space-between',
				gap: theme.spacing(1),
				width: '100%',
				padding: 2.5,
				background: theme.palette.dark[700],
				borderRadius: 1.5,
				position: 'relative'
			})}
		>
			<Link
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					left: 0,
					top: 0
				}}
				component={NavLink}
				to={`/forum/communityindividual/${forum.idx}`}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					overflow: 'hidden',
					justifyContent: 'space-between'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<MediumAvatar image={ipfsUrl(forum.avatar.some.url)} />
					<H4Title title={forum.title} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{forum.title}
					</H4Title>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
						<Icon icon="posts" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
						<Paragraph2 noWrap color="text.secondary">
							{forum.numPost} {!iSm && pluralize('post', Number(forum.numPost))}
						</Paragraph2>
					</Box>
					<Paragraph2 color="text.secondary">·</Paragraph2>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
						<Icon icon="message" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
						<Paragraph2 noWrap color="text.secondary">
							{forum.numComment} {!iSm && pluralize('comment', Number(forum.numComment))}
						</Paragraph2>
					</Box>

					<Paragraph2 color="text.secondary">·</Paragraph2>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
						<Icon icon="users" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
						<Paragraph2 noWrap color="text.secondary">
							{forum.followers.length} {!iSm && pluralize('member', Number(forum.followers.length))}
						</Paragraph2>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5
				}}
			>
				<Box display="inline-flex" flexDirection="row-reverse">
					{forum.followers.slice(0, 3).map(member => (
						<Box
							key={member}
							sx={{
								'&:not(:last-child)': {
									marginLeft: '-8px'
								}
							}}
						>
							<CAvatar
								skeletonWidth={32}
								sx={{
									width: theme => theme.spacing(4),
									height: theme => theme.spacing(4)
								}}
								address={member}
							/>
						</Box>
					))}
				</Box>
				{profile && (
					<QuaternaryButton
						sx={{ marginTop: 'auto', whiteSpace: 'nowrap' }}
						loading={isSubmitting}
						onClick={handleFollow}
					>
						{isFollowing ? 'LEAVE' : '+ JOIN'}
					</QuaternaryButton>
				)}
			</Box>
		</Box>
	);
};
