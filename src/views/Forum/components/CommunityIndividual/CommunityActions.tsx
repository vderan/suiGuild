import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import { QuaternaryButton } from 'src/components/Button';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import ShareBox from 'src/components/ShareBox';
import { AuthContext, IForum } from 'src/contexts';
import { useErrorHandler, useSnackbar } from 'src/hooks';

import { useGilder } from 'src/hooks/useGilder';

export const CommunityActions = ({ forum }: { forum: IForum }) => {
	const { profile, loadUserInfo } = useContext(AuthContext);
	const { follow, unfollow } = useGilder();
	const isFollowing = forum?.followers.find(follower => `0x${follower}` === profile?.id);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { warningSnackbar } = useSnackbar();
	const { errorProcess } = useErrorHandler();

	const handleFollow = async () => {
		if (profile?.id === `0x${forum.creatorInfo}` && isFollowing) {
			warningSnackbar("You can't leave your own community!");
			return;
		}
		setIsSubmitting(true);
		try {
			const idx = Number(forum.idx);
			isFollowing ? await unfollow(idx) : await follow(idx);
			await loadUserInfo();
		} catch (e) {
			errorProcess(e);
		}
		setIsSubmitting(false);
	};
	return (
		<Box display="flex" gap={0.75} alignItems="center" mt={{ xs: 0, lg: 0.6 }}>
			{profile && (
				<QuaternaryButton
					sx={{
						boxShadow: theme => `0 0 1px ${theme.palette.dark[900]}`,
						textShadow: theme => `0 0 1px ${theme.palette.dark[900]}`
					}}
					loading={isSubmitting}
					onClick={handleFollow}
				>
					{isFollowing ? 'LEAVE' : 'JOIN'}
				</QuaternaryButton>
			)}
			<Icon
				icon="notification"
				fontSize="small"
				sx={{
					filter: theme => `drop-shadow(0 0 1px ${theme.palette.dark[900]})`
				}}
			/>

			<ShareBox
				links={[
					{
						title: 'Copy URL',
						href: `${window.location.origin}/forum/communityindividual/${forum?.idx}`,
						icon: 'link'
					}
				]}
				element={
					<IconButton
						size="small"
						sx={{ filter: theme => `drop-shadow(0 0 1px ${theme.palette.dark[900]})`, padding: 0 }}
						icon="share"
					/>
				}
			/>
		</Box>
	);
};
