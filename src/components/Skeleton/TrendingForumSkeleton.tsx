import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import { Paragraph2 } from '../Typography';

export const TrendingForumSkeleton = () => {
	return (
		<TrendingForumSkeletonContainer>
			<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
				<Stack direction="row" alignItems="center" spacing={1}>
					<Skeleton variant="circular" height={40} width={40} />
					<Skeleton variant="text" height={30} width={100} />
				</Stack>
				<Skeleton variant="text" height={50} width={70} />
			</Stack>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Skeleton variant="text" height={20} width="100%" />
				<Paragraph2>·</Paragraph2>
				<Skeleton variant="text" height={20} width="100%" />
			</Stack>
		</TrendingForumSkeletonContainer>
	);
};

const TrendingForumSkeletonContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	borderTop: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
	display: 'flex',
	flexDirection: 'column',
	padding: theme.spacing(3),
	gap: theme.spacing(2)
}));
