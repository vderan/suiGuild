import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { CustomToggleButtonGroup, IToggleBtnOption } from 'src/components/ToggleButtonGroup';
import { CustomPagination } from 'src/components/Pagination';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';
import { usePosts } from 'src/hooks';
import { SortKey } from 'src/types/sort.types';
import { StandaloneInputField } from 'src/components/InputField';
import { PostCard } from 'src/components/Post';
import { getItemsPerPage, getPageCount } from 'src/helpers';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton, PostCardSkeleton } from 'src/components/Skeleton';
import { NotFound } from 'src/components/NotFound';

const toggleBtnOption: IToggleBtnOption[] = [
	{ id: 'new', value: 'new', label: 'Latest' },
	{ id: 'comments', value: 'comments', label: 'Hot' },
	{ id: 'votes', value: 'votes', label: 'Trending' }
];

export const CommunityIndividualPostList = () => {
	const { id: selectedCommunityId } = useParams();
	const { data: posts, isLoading, error: isError } = usePosts();

	const [searchVal, setSearchVal] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('new');
	const [pageNum, setPageNum] = useState(1);
	const [openedCommentIndex, setOpenedCommentIndex] = useState('');

	const filteredPosts = useMemo(() => {
		if (!posts) return [];

		const filteredTmpPosts = posts.filter(
			post => post.communityIdx === selectedCommunityId && post.title.toLowerCase().includes(searchVal)
		);

		const sortedPosts = sortPostsByKeyword(filteredTmpPosts, sortKey);
		return sortedPosts;
	}, [posts, selectedCommunityId, searchVal, sortKey]);

	const pageCount = getPageCount(filteredPosts.length);

	const pagePosts = useMemo(() => {
		return getItemsPerPage(filteredPosts, pageNum);
	}, [filteredPosts, pageNum]);

	const handleSearchChange = (value: string) => {
		handlePageNumChange(1);
		setSearchVal(value);
	};

	const handleSortKeyChange = (value: SortKey) => {
		setSortKey(value);
		handlePageNumChange(1);
	};

	const handlePageNumChange = (value: number) => {
		setOpenedCommentIndex('');
		setPageNum(value);
	};

	return (
		<Stack gap={3}>
			<Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
				<CustomToggleButtonGroup
					sx={{
						flexWrap: 'nowrap',
						overflow: 'visible',
						gap: 0.5
					}}
					defaultValue={sortKey}
					options={toggleBtnOption}
					onChange={value => handleSortKeyChange(value as SortKey)}
				/>
				<StandaloneInputField
					name="search"
					startIcon="search"
					value={searchVal}
					placeholder="Search"
					onChange={e => handleSearchChange(e.target.value)}
				/>
			</Box>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={2} sx={{ gap: 2 }}>
					<PostCardSkeleton />
				</ListSkeleton>
			) : pagePosts.length ? (
				<>
					<Stack gap={2}>
						{pagePosts.map(post => (
							<PostCard
								isShowForum={false}
								post={post}
								key={post.idx}
								onCommentToggle={setOpenedCommentIndex}
								openedCommentIndex={openedCommentIndex}
							/>
						))}
					</Stack>
					{pageCount > 1 && (
						<Stack justifyContent="flex-end">
							<CustomPagination count={pageCount} page={pageNum} onChange={value => handlePageNumChange(value)} />
						</Stack>
					)}
				</>
			) : (
				<NotFound description="No posts" />
			)}
		</Stack>
	);
};
