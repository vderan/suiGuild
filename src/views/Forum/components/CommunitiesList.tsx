import { useCallback, useContext, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { StandaloneInputField } from 'src/components/InputField';
import { CustomToggleButtonGroup, IToggleBtnOption } from 'src/components/ToggleButtonGroup';
import { CustomPagination } from 'src/components/Pagination';
import { sortForumsByKeyword } from 'src/helpers/sort.helpers';
import { useForums } from 'src/hooks';
import { CommunitySortKey } from 'src/types/sort.types';
import { NotFound } from 'src/components/NotFound';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { getItemsPerPage, getPageCount } from 'src/helpers';
import { CommunityCardSkeleton, ListSkeleton } from 'src/components/Skeleton';
import { StandaloneSelect } from 'src/components/Select';
import { CommunityCard } from './CommunityCard';
import { AuthContext } from 'src/contexts';
import dayjs from 'dayjs';

const sortOptions: IToggleBtnOption[] = [
	{ id: 'new', value: 'new', label: 'New' },
	{ id: 'posts', value: 'posts', label: 'Posts' },
	{ id: 'comments', value: 'comments', label: 'Comments' },
	{ id: 'popular', value: 'popular', label: 'Popular' }
];

export const CommunitiesList = () => {
	const { followingCommunities, profile } = useContext(AuthContext);

	const [pageNum, setPageNum] = useState(1);
	const [sortKey, setSortKey] = useState<CommunitySortKey>('new');
	const [search, setSearch] = useState('');
	const { data: _forums, isLoading, error: isError } = useForums();
	const [communitiesFilterKey, setCommunitiesFilterKey] = useState('all');

	const handleSortKeyChange = (value: CommunitySortKey) => {
		setSortKey(value);
		handlePageNumChange(1);
	};

	const getFilteredForums = useCallback(
		(toggleKey: string) => {
			if (!_forums) return [];

			switch (toggleKey) {
				case 'following': {
					return followingCommunities.flatMap(community => _forums.find(i => i.idx === community) || []);
				}
				case 'new': {
					return _forums.filter(forum => dayjs().diff(dayjs(Number(forum.createdAt)), 'day') === 0);
				}
				case 'popular': {
					return _forums.filter(forum => dayjs().diff(dayjs(Number(forum.createdAt)), 'day') < 7);
				}
				case 'all':
					return _forums;
			}
		},
		[followingCommunities, _forums]
	);

	const searchedForums = useMemo(() => {
		if (!_forums) return [];

		const filteredForums = getFilteredForums(communitiesFilterKey);
		if (!filteredForums) return [];

		const tmpForums = filteredForums.filter(forum => forum.title.toLowerCase().includes(search));

		return sortForumsByKeyword(tmpForums, sortKey);
	}, [_forums, communitiesFilterKey, getFilteredForums, search, sortKey]);

	const forums = useMemo(() => {
		return getItemsPerPage(searchedForums, pageNum);
	}, [searchedForums, pageNum]);

	const pageCount = getPageCount(searchedForums.length);

	const handleSearchKeyChange = (searchVal: string) => {
		setSearch(searchVal);
		handlePageNumChange(1);
	};

	const handlePageNumChange = (value: number) => {
		setPageNum(value);
	};

	const communitiesFilterOptions: IToggleBtnOption[] = [
		{ id: 'all', value: 'all', label: 'All' },
		...(profile ? [{ id: 'following', value: 'following', label: 'Following' }] : []),
		{ id: 'popular', value: 'popular', label: 'Popular this week' },
		{ id: 'new', value: 'new', label: 'New' }
	];

	return (
		<Stack sx={{ gap: 3 }}>
			<CustomToggleButtonGroup
				defaultValue="all"
				options={communitiesFilterOptions}
				onChange={val => setCommunitiesFilterKey(val)}
			/>
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
					onChange={sort => handleSortKeyChange(sort as CommunitySortKey)}
				/>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : isLoading ? (
					<ListSkeleton numberOfItems={4} sx={{ gap: 2 }}>
						<CommunityCardSkeleton />
					</ListSkeleton>
				) : forums.length ? (
					<>
						{forums.map(forum => (
							<CommunityCard forum={forum} key={forum.idx} />
						))}
						{pageCount > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								<CustomPagination count={pageCount} page={pageNum} onChange={value => handlePageNumChange(value)} />
							</Box>
						)}
					</>
				) : (
					<NotFound description="No communities" />
				)}
			</Box>
		</Stack>
	);
};
