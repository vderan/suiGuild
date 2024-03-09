import { Box, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { MediumAvatar } from 'src/components/Avatar';
import { Icon } from 'src/components/Icon';
import { ButtonMediumText, Paragraph2 } from 'src/components/Typography';
import { AuthContext, IForum } from 'src/contexts';
import pluralize from 'pluralize';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useContext, useState } from 'react';
import { QuaternaryButton } from 'src/components/Button';
import { toast } from 'react-toastify';
import { useGilder } from 'src/hooks/useGilder';
import { ErrorHandler } from 'src/helpers';

export const CommunityCardSmall = ({ forum }: { forum: IForum }) => {
	const { follow, unfollow } = useGilder();
	const { profile, loadUserInfo } = useContext(AuthContext);
	const isFollowing = forum.followers.some(follower => `0x${follower}` === profile?.id);
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
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
				width: '100%',
				position: 'relative',
				pb: 2.5,
				borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
			}}
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
					gap: 1,
					justifyContent: 'space-between'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
					<MediumAvatar image={ipfsUrl(forum.avatar.some.url)} />
					<ButtonMediumText title={forum.title} noWrap>
						{forum.title}
					</ButtonMediumText>
				</Box>
				{profile && (
					<QuaternaryButton sx={{ whiteSpace: 'nowrap' }} loading={isSubmitting} onClick={handleFollow}>
						{isFollowing ? 'LEAVE' : '+ JOIN'}
					</QuaternaryButton>
				)}
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
					<Icon icon="posts" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
					<Paragraph2 noWrap color="text.secondary">
						{forum.numPost} {pluralize('post', Number(forum.numPost))}
					</Paragraph2>
				</Box>

				<Paragraph2 color="text.secondary">·</Paragraph2>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
					<Icon icon="users" fontSize="extraSmall" sx={{ color: theme => theme.palette.text.secondary }} />
					<Paragraph2 noWrap color="text.secondary">
						{forum.followers.length} {pluralize('member', Number(forum.followers.length))}
					</Paragraph2>
				</Box>
			</Box>
		</Box>
	);
};
