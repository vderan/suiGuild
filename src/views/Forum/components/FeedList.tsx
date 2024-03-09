import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { StandaloneInputField } from 'src/components/InputField';
import { IToggleBtnOption } from 'src/components/ToggleButtonGroup';
import { PostCardSkeleton } from 'src/components/Skeleton/PostCardSkeleton';
import { CustomPagination } from 'src/components/Pagination';
import { sortPostsByKeyword } from 'src/helpers/sort.helpers';
import { usePosts } from 'src/hooks';
import { SortKey as FeedSortKey } from 'src/types/sort.types';
import { NotFound } from 'src/components/NotFound';
import { PostCard } from 'src/components/Post';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { getItemsPerPage, getPageCount } from 'src/helpers';
import { ListSkeleton } from 'src/components/Skeleton';
import { StandaloneSelect } from 'src/components/Select';

const sortOptions: IToggleBtnOption[] = [
	{ id: 'new', value: 'new', label: 'New' },
	{ id: 'comments', value: 'comments', label: 'Comments' },
	{ id: 'votes', value: 'votes', label: 'Votes' }
];

export const FeedList = () => {
	const [pageNum, setPageNum] = useState(1);
	const [sortKey, setSortKey] = useState<FeedSortKey>('new');
	const [search, setSearch] = useState('');
	const { data: posts, isLoading, error: isError } = usePosts();
	const [openedCommentIndex, setOpenedCommentIndex] = useState('');

	const handleSortKeyChange = (value: FeedSortKey) => {
		setSortKey(value);
		handlePageNumChange(1);
	};

	const searchedPosts = useMemo(() => {
		if (!posts) return [];

		const tmpPosts = posts.filter(post => post.title.toLowerCase().includes(search));

		return sortPostsByKeyword(tmpPosts, sortKey);
	}, [posts, search, sortKey]);

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
		<Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
			<Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
				<StandaloneInputField
					value={search}
					boxSx={{ width: 'initial', flex: 1 }}
					name="search"
					placeholder="Search"
					startIcon="search"
					onChange={e => handleSearchKeyChange(e.target.value)}
				/>
				<StandaloneSelect
					boxSx={{ minWidth: theme => ({ xs: 'initial', sm: theme.spacing(20) }) }}
					name="select"
					placeholder="Sort by"
					fullWidth
					value={sortKey}
					options={sortOptions}
					onChange={sort => handleSortKeyChange(sort as FeedSortKey)}
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
