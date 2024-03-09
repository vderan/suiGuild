import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';

export const TransactionCardSkeleton = () => {
	return (
		<TransactionCardSkeletonContainer>
			<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
				<Stack direction="row" alignItems="center" spacing={1}>
					<Skeleton variant="circular" height={32} width={32} />
					<Skeleton variant="text" height={30} width={100} />
				</Stack>
			</Stack>
			<Skeleton variant="text" height={30} width={70} />
		</TransactionCardSkeletonContainer>
	);
};

const TransactionCardSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	backgroundColor: theme.palette.dark[700],
	borderRadius: theme.spacing(1),
	padding: theme.spacing(1.5),
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: theme.spacing(2)
}));
