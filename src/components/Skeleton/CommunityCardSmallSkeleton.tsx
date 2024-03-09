import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import { Paragraph2 } from '../Typography';

export const CommunityCardSmallSkeleton = () => {
	return (
		<CommunityCardSmallSkeletonContainer>
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Stack direction="row" spacing={1} width="100%">
					<Skeleton variant="circular" height={24} width={24} />
					<Skeleton variant="text" height={21} width="30%" />
				</Stack>
				<Skeleton variant="rounded" height={20} width={70} />
			</Stack>
			<Stack direction="row" alignItems="center" spacing={2} width="50%">
				<Skeleton variant="text" height={20} width="100%" />
				<Paragraph2>·</Paragraph2>
				<Skeleton variant="text" height={20} width="100%" />
			</Stack>
		</CommunityCardSmallSkeletonContainer>
	);
};

const CommunityCardSmallSkeletonContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
	gap: theme.spacing(2),
	paddingBottom: theme.spacing(2.5),
	borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
}));
