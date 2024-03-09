import { useMemo } from 'react';
import { Box } from '@mui/material';
import { usePosts } from 'src/hooks';
import { H3Title } from 'src/components/Typography';
import { ListSkeleton, PostCardSmallSkeleton } from 'src/components/Skeleton';
import { PostCardSmall } from 'src/components/Post';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { NotFound } from 'src/components/NotFound';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';

export const TrendingPosts = () => {
	const { data: posts, isLoading, error: isError } = usePosts();

	const trendingPosts = useMemo(() => {
		if (!posts) return [];

		const filteredPosts = posts.filter(post => Number(post.vote) > 0);
		return sortPostsByKeyword(filteredPosts, 'votes').slice(0, 6);
	}, [posts]);

	return (
		<Box display="flex" flexDirection="column" gap={2.5}>
			<H3Title> Trending Posts </H3Title>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={2} sx={{ gap: 2.5 }}>
					<PostCardSmallSkeleton />
				</ListSkeleton>
			) : trendingPosts.length ? (
				trendingPosts.map(post => <PostCardSmall post={post} key={post.idx} />)
			) : (
				<NotFound description="No posts" />
			)}
		</Box>
	);
};
