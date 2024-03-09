import { useContext, useMemo } from 'react';
import { Box } from '@mui/material';
import { PostCardSmallSkeleton, ListSkeleton } from 'src/components/Skeleton';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';
import { NotFound } from 'src/components/NotFound';
import { PostCardSmall } from 'src/components/Post';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { AuthContext } from 'src/contexts';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useGilder } from 'src/hooks/useGilder';
import { useProfile } from 'src/hooks/useProfile';

export const HomeRecentsPostList = () => {
	const { getPosts } = useGilder();
	const { getUserInfo } = useProfile();
	const { isLoggedIn, profile } = useContext(AuthContext);

	const {
		data: posts,
		isLoading,
		error: isError
	} = useCustomSWR('getRecentsPosts' + isLoggedIn, async () => {
		const posts = await getPosts();
		if (isLoggedIn) {
			const data = await Promise.all(
				posts?.map(async post => {
					const user = await getUserInfo(post.creatorInfo);
					return user?.userInfo.some?.displayName && profile?.friends.includes(user?.userInfo.some?.displayName)
						? post
						: [];
				})
			);
			return data.flat();
		}
		return posts;
	});

	const filteredPosts = useMemo(() => {
		if (!posts) return [];

		return sortPostsByKeyword(posts, 'new').slice(0, 5);
	}, [posts]);

	return (
		<Box sx={{ display: 'flex', gap: 2.5, flexDirection: 'column' }}>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={2} sx={{ gap: 2.5 }}>
					<PostCardSmallSkeleton />
				</ListSkeleton>
			) : filteredPosts.length ? (
				filteredPosts.map(post => <PostCardSmall post={post} key={post.idx} />)
			) : (
				<NotFound description="No posts" />
			)}
		</Box>
	);
};
