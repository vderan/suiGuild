import { Box, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { NotFound } from 'src/components/NotFound';
import { CustomPagination } from 'src/components/Pagination';
import { ListSkeleton } from 'src/components/Skeleton';
import { CommunityCardSmallSkeleton } from 'src/components/Skeleton/CommunityCardSmallSkeleton';
import { H3Title } from 'src/components/Typography';
import { getItemsPerPage, getPageCount } from 'src/helpers';
import { useForums } from 'src/hooks';
import { useDevice } from 'src/hooks/useDevice';
import { CommunityCardSmall } from 'src/views/Forum/components/CommunityCardSmall';

const PAGE_LIMIT = 7;

export const Communities = () => {
	const [pageNum, setPageNum] = useState(1);

	const { iMid } = useDevice();
	const { data: forums, isLoading, error: isError } = useForums();

	const allForums = useMemo(() => {
		if (!forums) {
			return [];
		}
		return getItemsPerPage(forums, pageNum, PAGE_LIMIT);
	}, [forums, pageNum]);

	const pageCount = getPageCount(forums?.length || 0, PAGE_LIMIT);
	return (
		<Stack
			direction="column"
			gap={2}
			sx={theme => ({
				[theme.breakpoints.down('lg')]: {
					padding: 3,
					border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
					borderRadius: 1
				}
			})}
		>
			<H3Title>Communities</H3Title>

			<Stack gap={2.5}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : isLoading ? (
					<ListSkeleton numberOfItems={4} sx={{ gap: 2.5 }}>
						<CommunityCardSmallSkeleton />
					</ListSkeleton>
				) : allForums.length ? (
					<>
						{allForums.map(forum => (
							<CommunityCardSmall forum={forum} key={forum.idx} />
						))}
						{pageCount > 1 && iMid && (
							<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								<CustomPagination count={pageCount} page={pageNum} onChange={value => setPageNum(value)} />
							</Box>
						)}
					</>
				) : (
					<NotFound description="No communities" />
				)}
			</Stack>
		</Stack>
	);
};
