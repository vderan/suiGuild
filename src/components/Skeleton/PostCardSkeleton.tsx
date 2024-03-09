import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';

export const PostCardSkeleton = () => {
	return (
		<PostCardSkeletonContainer>
			<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
				<Skeleton variant="text" height={36} width={100} />

				<Stack direction="row" alignItems="center" spacing={1}>
					<Skeleton variant="circular" height={24} width={24} />
					<Skeleton variant="text" height={14} width={200} />
				</Stack>
			</Stack>
			<Stack>
				<Skeleton variant="text" height={21} width="50%" />
			</Stack>
			<Stack direction="column" alignItems="center" spacing={2}>
				<Skeleton variant="text" height={16} width="100%" />
				<Skeleton variant="text" height={16} width="100%" />
				<Skeleton variant="text" height={16} width="100%" />
				<Skeleton variant="text" height={16} width="100%" />
			</Stack>
			<Stack direction="column" alignItems="start" spacing={2}>
				<Stack direction="row" alignItems="center" spacing={2}>
					<Skeleton variant="text" height={12} width={70} />
					<Skeleton variant="text" height={12} width={70} />
				</Stack>
			</Stack>
		</PostCardSkeletonContainer>
	);
};

const PostCardSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	padding: theme.spacing(4),
	background: theme.palette.dark[700],
	borderRadius: theme.spacing(1.5)
}));
