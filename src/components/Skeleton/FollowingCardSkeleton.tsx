import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';

export const FollowingCardSkeleton = () => {
	return (
		<FollowingCardSkeletonContainer>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Skeleton variant="circular" height={40} width={40} />
				<Skeleton variant="text" height={30} width={100} />
			</Stack>
			<Skeleton variant="text" height={50} width={70} />
		</FollowingCardSkeletonContainer>
	);
};

const FollowingCardSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	borderTop: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	padding: theme.spacing(3),
	gap: theme.spacing(2)
}));
