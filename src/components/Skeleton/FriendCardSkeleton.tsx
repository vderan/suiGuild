import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/system';

export const FriendCardSkeleton = () => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			sx={{
				padding: theme => theme.spacing(2, 0),
				borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
			}}
		>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Skeleton variant="circular" height={20} width={20} />
				<Skeleton variant="text" height={16} width={100} />
			</Stack>
			<Skeleton variant="rounded" height={32} width={32} />
		</Stack>
	);
};
