import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { QuaternaryButton } from 'src/components/Button';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import ShareBox from 'src/components/ShareBox';
import { AuthContext, IForum } from 'src/contexts';
import { ErrorHandler } from 'src/helpers';
import { useGilder } from 'src/hooks/useGilder';

export const CommunityActions = ({ forum }: { forum: IForum }) => {
	const { profile, loadUserInfo } = useContext(AuthContext);
	const { follow, unfollow } = useGilder();
	const isFollowing = forum?.followers.find(follower => `0x${follower}` === profile?.id);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFollow = async () => {
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
		<Box display="flex" gap={0.75} alignItems="center" mt={{ xs: 0, lg: 0.6 }}>
			{profile && (
				<QuaternaryButton
					sx={{
						boxShadow: '0 0 1px #000000'
					}}
					loading={isSubmitting}
					onClick={handleFollow}
				>
					{isFollowing ? 'LEAVE' : 'JOIN'}
				</QuaternaryButton>
			)}
			<Icon icon="notification" fontSize="small" sx={{ filter: 'drop-shadow(0 0 3px #000000)' }} />

			<ShareBox
				links={[
					{
						title: 'Copy URL',
						href: `${window.location.origin}/forum/communityindividual/${forum?.idx}`,
						icon: 'link'
					}
				]}
				element={<IconButton size="small" sx={{ filter: 'drop-shadow(0 0 3px #000000)', padding: 0 }} icon="share" />}
			/>
		</Box>
	);
};
