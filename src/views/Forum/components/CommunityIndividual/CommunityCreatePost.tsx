import { Box, Button, Skeleton, Stack, styled } from '@mui/material';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomAvatar } from 'src/components/Avatar';
import { Dialog } from 'src/components/Dialog';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { PrimaryEditor } from 'src/components/TextEditor';
import { Paragraph2 } from 'src/components/Typography';
import { avatarUrl } from 'src/constants/images.constants';
import { AuthContext, IForum } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useDevice } from 'src/hooks/useDevice';

const Wrapper = styled(Stack)(({ theme }) => ({
	flexDirection: 'row',
	background: theme.palette.dark[700],
	border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
	borderRadius: theme.spacing(1),
	padding: theme.spacing(2),
	alignItems: 'center',
	gap: theme.spacing(1.5),
	justifyContent: 'space-between'
}));

export const CommunityCreatePost = ({ forum, isLoading = false }: { forum?: IForum; isLoading?: boolean }) => {
	const { profile, isLoggedIn } = useContext(AuthContext);
	const { iMid } = useDevice();
	const [isCreatePostModalShown, setIsCreatePostModalShown] = useState(false);

	const openCreatePostModal = () => {
		const isFollowing = forum?.followers.some(follower => `0x${follower}` === profile?.id);
		if (!isFollowing) {
			toast.warning('You can not post about communities you do not follow!', { theme: 'colored' });
			return;
		}
		setIsCreatePostModalShown(true);
	};

	return isLoggedIn ? (
		isLoading ? (
			<Wrapper>
				<Skeleton variant="circular" width={40} height={40} />
				<Skeleton variant="rounded" width="100%" height={40} />
			</Wrapper>
		) : forum ? (
			<Wrapper>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
					{profile?.avatar && (
						<CustomAvatar
							image={ipfsUrl(profile?.avatar ?? avatarUrl)}
							sx={{ width: theme => theme.spacing(5), height: theme => theme.spacing(5), mr: 2 }}
						/>
					)}
					<Button
						sx={theme => ({
							width: '100%',
							padding: 1.5,
							justifyContent: 'space-between',
							borderRadius: 1,
							background: 'transparent',
							border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
							textTransform: 'none'
						})}
						onClick={openCreatePostModal}
						endIcon={<Icon icon="mood" />}
					>
						<Paragraph2 sx={{ opacity: 0.5 }}>Type a message...</Paragraph2>
					</Button>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					{iMid ? (
						<IconButton icon="add" onClick={openCreatePostModal} />
					) : (
						<>
							<IconButton icon="image" onClick={openCreatePostModal} />
							<IconButton icon="gif" onClick={openCreatePostModal} />
							<IconButton icon="attachFile" onClick={openCreatePostModal} />
						</>
					)}
				</Box>

				<Dialog
					title="Create post"
					nofooter
					open={isCreatePostModalShown}
					onClose={() => setIsCreatePostModalShown(false)}
				>
					<PrimaryEditor onCreate={() => setIsCreatePostModalShown(false)} communityIndex={Number(forum.idx)} />
				</Dialog>
			</Wrapper>
		) : (
			<></>
		)
	) : (
		<></>
	);
};
