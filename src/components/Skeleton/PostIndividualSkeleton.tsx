import { Stack, Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/system';

export const PostIndividualSkeleton = () => {
	return (
		<PostIndividualSkeletonContainer>
			<Skeleton variant="text" height={40} width="50%" />
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Stack direction="row" alignItems="center" gap={1}>
					<Skeleton variant="rounded" height={20} width={70} />
					<Skeleton variant="text" height={20} width={50} />
				</Stack>
				<Stack direction="row" alignItems="center" gap={1}>
					<Skeleton variant="circular" height={24} width={24} />
					<Skeleton variant="text" height={20} width={100} />
				</Stack>
			</Stack>
			<Box className="card-box">
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
			</Box>
			<Box className="card-box">
				<Skeleton variant="text" height={20} width={150} />
			</Box>
		</PostIndividualSkeletonContainer>
	);
};

const PostIndividualSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	'& .card-box': {
		padding: theme.spacing(2),
		background: theme.palette.dark[700],
		borderRadius: theme.spacing(1.5)
	}
}));
