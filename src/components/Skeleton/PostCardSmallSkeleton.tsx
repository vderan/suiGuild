import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import { Paragraph2 } from '../Typography';

export const PostCardSmallSkeleton = () => {
	return (
		<PostCardSmallSkeletonContainer>
			<Stack direction="row" alignItems="center" gap={1} justifyContent="space-between">
				<Skeleton variant="circular" height={32} width={32} />
				<Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
					<Skeleton variant="text" height={14} width={50} />
					<Skeleton variant="circular" height={24} width={24} />
					<Skeleton variant="text" height={14} width={70} />
				</Stack>
			</Stack>
			<Skeleton variant="text" height={30} width="100%" />
			<Stack>
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
				<Skeleton variant="text" height={20} width="100%" />
			</Stack>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Skeleton variant="text" height={20} width="20%" />
				<Paragraph2>·</Paragraph2>
				<Skeleton variant="text" height={20} width="20%" />
			</Stack>
		</PostCardSmallSkeletonContainer>
	);
};

const PostCardSmallSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(1),
	paddingBottom: theme.spacing(2.5),
	borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
}));
