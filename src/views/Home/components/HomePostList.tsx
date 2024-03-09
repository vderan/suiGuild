import { useContext, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { StandaloneInputField } from 'src/components/InputField';
import { CustomToggleButtonGroup, IToggleBtnOption } from 'src/components/ToggleButtonGroup';
import { AuthContext } from 'src/contexts';
import { PostCardSkeleton } from 'src/components/Skeleton/PostCardSkeleton';
import { CustomPagination } from 'src/components/Pagination';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';
import { usePosts } from 'src/hooks';
import { PostSortKey } from 'src/types/sort.types';
import { NotFound } from 'src/components/NotFound';
import { PostCard } from 'src/components/Post';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { getItemsPerPage, getPageCount } from 'src/helpers';
import { ListSkeleton } from 'src/components/Skeleton';

export const HomePostList = () => {
	const { followingCommunities, isLoggedIn } = useContext(AuthContext);

	const [pageNum, setPageNum] = useState(1);
	const [sortKey, setSortKey] = useState<PostSortKey>('following');
	const [search, setSearch] = useState('');
	const { data: posts, isLoading, error: isError } = usePosts();
	const [openedCommentIndex, setOpenedCommentIndex] = useState('');

	const options: IToggleBtnOption[] = [
		{ id: 'following', value: 'following', label: 'Following', startIcon: 'star' },
		{ id: 'comments', value: 'comments', label: 'Hot', startIcon: 'stars' },
		{ id: 'new', value: 'new', label: 'New', startIcon: 'fire' }
	];

	const handleSortKeyChange = (value: PostSortKey) => {
		setSortKey(value);
		handlePageNumChange(1);
	};

	const searchedPosts = useMemo(() => {
		try {
			if (!posts) {
				return [];
			}
			const tmpPosts = posts.filter(post => post.title.toLowerCase().includes(search));
			if (!isLoggedIn) return sortPostsByKeyword(tmpPosts, 'new');
			if (sortKey === 'following') {
				if (!followingCommunities.length) return [];
				return sortPostsByKeyword(
					tmpPosts.filter(post => followingCommunities.includes(post.communityIdx)),
					'new'
				);
			}
			return sortPostsByKeyword(tmpPosts, sortKey);
		} catch (e) {
			return [];
		}
	}, [posts, search, sortKey, isLoggedIn, followingCommunities]);

	const filteredPosts = useMemo(() => {
		return getItemsPerPage(searchedPosts, pageNum);
	}, [searchedPosts, pageNum]);

	const pageCount = getPageCount(searchedPosts.length);

	const handleSearchKeyChange = (searchVal: string) => {
		setSearch(searchVal);
		handlePageNumChange(1);
	};

	const handlePageNumChange = (value: number) => {
		setOpenedCommentIndex('');
		setPageNum(value);
	};

	return (
		<Box sx={{ display: 'flex', gap: 2.25, flexDirection: 'column' }}>
			<Box sx={{ display: 'flex', gap: 2.25, flexDirection: { xs: 'column', lg: 'row' } }}>
				{isLoggedIn && (
					<CustomToggleButtonGroup
						sx={{ flexWrap: 'nowrap' }}
						defaultValue={sortKey}
						options={options}
						onChange={value => handleSortKeyChange(value as PostSortKey)}
					/>
				)}
				<StandaloneInputField
					value={search}
					boxSx={{ width: 'initial', flex: 1 }}
					name="search"
					placeholder="Search"
					startIcon="search"
					onChange={e => handleSearchKeyChange(e.target.value)}
				/>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : isLoading ? (
					<ListSkeleton numberOfItems={2} sx={{ gap: 2 }}>
						<PostCardSkeleton />
					</ListSkeleton>
				) : filteredPosts.length ? (
					<>
						{filteredPosts.map(post => (
							<PostCard
								post={post}
								key={post.idx}
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
			</Box>
		</Box>
	);
};
