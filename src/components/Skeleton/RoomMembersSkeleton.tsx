import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import React from 'react';

export const RoomMembersSkeleton = () => {
	return (
		<>
			{Array.from({ length: 7 }).map((_, index) => (
				<React.Fragment key={index}>
					<Stack direction="row" alignItems="center" height={32} spacing={1} width="100%">
						<Skeleton
							variant="circular"
							sx={{
								minHeight: 32,
								minWidth: 32
							}}
						/>
						<Skeleton variant="text" width="100%" />
					</Stack>
				</React.Fragment>
			))}
		</>
	);
};
