import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useDevice } from 'src/hooks/useDevice';

export const GroupChatHeaderSkeleton = () => {
	const { iLg } = useDevice();

	return (
		<>
			<Box>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Skeleton variant="text" height={45} width={200} />
				</Stack>
			</Box>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Skeleton
					variant="circular"
					sx={{
						minWidth: 40,
						minHeight: 40
					}}
				/>
				<Skeleton
					variant="circular"
					sx={{
						minWidth: 40,
						minHeight: 40
					}}
				/>
				<Skeleton
					variant={!iLg ? 'rounded' : 'circular'}
					sx={{
						minWidth: !iLg ? 150 : 40,
						minHeight: 40
					}}
				/>
			</Stack>
		</>
	);
};
