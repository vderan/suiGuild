import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';

export const DraftCardSkeleton = () => {
	return (
		<DraftCardSkeletonContainer>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Skeleton variant="text" height={20} width={150} />
				<Skeleton variant="text" height={16} width={80} />
			</Stack>
			<Stack direction="column">
				<Skeleton variant="text" height={30} width={200} />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
			</Stack>

			<Skeleton variant="rounded" height={20} width={100} />
		</DraftCardSkeletonContainer>
	);
};

const DraftCardSkeletonContainer = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(3),
	padding: theme.spacing(3),
	background: theme.palette.dark[700],
	borderRadius: theme.spacing(1)
}));
