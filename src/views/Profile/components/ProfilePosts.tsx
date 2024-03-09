import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import { H2Title } from 'src/components/Typography';
import { NotFound } from 'src/components/NotFound';
import { Box, Grid } from '@mui/material';
import { usePosts } from 'src/hooks';
import { Communities } from './Communities';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton, PostCardSkeleton } from 'src/components/Skeleton';
import { PostCard } from 'src/components/Post';
import { CustomPagination } from 'src/components/Pagination';
import { getItemsPerPage, getPageCount } from 'src/helpers';

export const ProfilePosts = ({ userId }: { userId: string | undefined }) => {
	const [pageNum, setPageNum] = useState(1);
	const [openedCommentIndex, setOpenedCommentIndex] = useState('');

	const { data: posts, isLoading, error: isError } = usePosts();

	const sortedPosts = useMemo(() => {
		if (!posts || !userId) {
			return [];
		}

		const tmpPosts = posts.filter(uPost => `0x${uPost.creatorInfo}` === userId);
		return sortPostsByKeyword(tmpPosts, 'new');
	}, [posts, userId]);

	const userPosts = useMemo(() => {
		return getItemsPerPage(sortedPosts, pageNum);
	}, [sortedPosts, pageNum]);

	const pageCount = getPageCount(sortedPosts.length);

	const handlePageNumChange = (value: number) => {
		setOpenedCommentIndex('');
		setPageNum(value);
	};

	return (
		<Grid container spacing={{ xs: 4, xl: 10 }}>
			<Grid item xs={12} sm={12} md={12} lg={8.25}>
				<Stack gap={2.5}>
					<H2Title>Posts and comments</H2Title>
					<Stack gap={2}>
						{isError ? (
							<ErrorMessage description="There was an error while loading" />
						) : isLoading ? (
							<ListSkeleton numberOfItems={2} sx={{ gap: 2 }}>
								<PostCardSkeleton />
							</ListSkeleton>
						) : userPosts.length ? (
							<>
								{userPosts.map(post => (
									<PostCard
										post={post}
										key={post.idx}
										isEditBtnShown
										onCommentToggle={setOpenedCommentIndex}
										openedCommentIndex={openedCommentIndex}
									/>
								))}
								{pageCount > 1 && (
									<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
										<CustomPagination count={pageCount} page={pageNum} onChange={value => handlePageNumChange(value)} />
									</Box>
								)}
							</>
						) : (
							<NotFound description="No posts" />
						)}
					</Stack>
				</Stack>
			</Grid>
			<Grid item xs={12} lg={3.75}>
				<Communities />
			</Grid>
		</Grid>
	);
};
