import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import React from 'react';

export const GroupChatsSkeleton = () => {
	return (
		<>
			{Array.from({ length: 9 }).map((_, index) => (
				<React.Fragment key={index}>
					<Stack direction="row" alignItems="center" height={64} sx={{ p: 1.5 }} spacing={1}>
						<Skeleton
							variant="circular"
							sx={{
								minHeight: 32,
								minWidth: 32
							}}
						/>
						<Stack direction="column" width="100%">
							<Skeleton variant="text" />
							<Skeleton variant="text" />
						</Stack>
					</Stack>
				</React.Fragment>
			))}
		</>
	);
};
