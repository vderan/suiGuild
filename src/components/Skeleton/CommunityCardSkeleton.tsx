import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import { Paragraph2 } from '../Typography';

export const CommunityCardSkeleton = () => {
	return (
		<CommunityCardSkeletonContainer>
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Stack direction="row" spacing={1} width="100%">
					<Skeleton variant="circular" height={24} width={24} />
					<Skeleton variant="text" height={21} width="30%" />
				</Stack>
				<Skeleton variant="circular" height={32} width={32} />
			</Stack>
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Stack direction="row" alignItems="center" spacing={2} width="50%">
					<Skeleton variant="text" height={20} width="100%" />
					<Paragraph2>·</Paragraph2>
					<Skeleton variant="text" height={20} width="100%" />
					<Paragraph2>·</Paragraph2>
					<Skeleton variant="text" height={20} width="100%" />
				</Stack>
				<Skeleton variant="rounded" height={20} width={70} />
			</Stack>
		</CommunityCardSkeletonContainer>
	);
};

const CommunityCardSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	padding: theme.spacing(2.5),
	background: theme.palette.dark[700],
	borderRadius: theme.spacing(1.5)
}));
