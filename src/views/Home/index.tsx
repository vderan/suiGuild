import { Box } from '@mui/material';
import { HomePostList } from './components/HomePostList';
import { HomeRecentsPostList } from './components/HomeRecentsPostList';
import { WelcomeBanner } from './components/WelcomeBanner';
import { AuthContext } from 'src/contexts';
import { useContext, useState } from 'react';
import { AddFriends } from 'src/components/AddFriends';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CreateCommunityModal } from 'src/components/Community';
import { H3Title } from 'src/components/Typography';
import { useDevice } from 'src/hooks/useDevice';

export const Home = () => {
	const { isLoggedIn } = useContext(AuthContext);
	const { iMid } = useDevice();

	return (
		<Box sx={{ pt: { xs: 2.5, lg: 5 }, maxWidth: { xs: '1356px', desktop: '1084px' }, mx: 'auto' }}>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: 'minmax(100px, 1fr)', lg: 'minmax(100px, 1fr) minmax(100px, 320px)' }
				}}
				gap={{ xs: 5, lg: 7.375 }}
			>
				<Box
					sx={{
						gap: { xs: 5, lg: 4 },
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						maxWidth: { xs: 'none', lg: '704px' },
						mx: 'auto'
					}}
				>
					{!isLoggedIn && <WelcomeBanner />}
					{isLoggedIn && iMid && <AddFriendsAndActions />}
					<HomePostList />
				</Box>

				<Box sx={{ gap: 4, display: 'flex', flexDirection: 'column' }}>
					{isLoggedIn && !iMid && <AddFriendsAndActions />}
					<Box
						sx={theme => ({
							gap: 2.5,
							display: 'flex',
							flexDirection: 'column',
							[theme.breakpoints.down('lg')]: {
								padding: 3,
								background: theme.palette.dark[500],
								borderRadius: 1.5,
								border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
							}
						})}
					>
						<H3Title>{isLoggedIn ? 'Friends activities' : 'Recent posts'}</H3Title>
						<HomeRecentsPostList />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

const AddFriendsAndActions = () => {
	const { profile } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);

	return (
		<Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
			<Box display="flex" gap={1} flexWrap="wrap">
				<PrimaryButton
					sx={{ flex: 1, minWidth: theme => theme.spacing(13) }}
					onClick={() => {
						if (!profile?.displayName) {
							toast.warning('You should have your own display name!', { theme: 'colored' });
							navigate(`/setting/${profile?.id}/eprofile`);
						} else {
							navigate('/createpost');
						}
					}}
				>
					Create Post
				</PrimaryButton>
				<SecondaryButton sx={{ flex: 1 }} onClick={() => setIsCreateCommunityModalOpen(true)}>
					Create Community
				</SecondaryButton>
			</Box>
			<AddFriends />
			<CreateCommunityModal isOpen={isCreateCommunityModalOpen} onClose={() => setIsCreateCommunityModalOpen(false)} />
		</Box>
	);
};
