import { Box } from '@mui/material';
import { H3Title } from 'src/components/Typography';
import { sortForumsByKeyword } from 'src/helpers/sort.helpers';
import { useForums } from 'src/hooks';
import { useContext, useMemo } from 'react';
import { ListSkeleton } from 'src/components/Skeleton';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { NotFound } from 'src/components/NotFound';
import { CommunityCardSmall } from './CommunityCardSmall';
import { CommunityCardSmallSkeleton } from 'src/components/Skeleton/CommunityCardSmallSkeleton';
import { AuthContext } from 'src/contexts';

export const SuggestedCommunities = () => {
	const { followingCommunities } = useContext(AuthContext);

	const { data: forums, isLoading, error: isError } = useForums();

	const topForums = useMemo(() => {
		const _forums = forums?.filter(forum => !followingCommunities.includes(forum.idx));
		return sortForumsByKeyword(_forums || [], 'posts').slice(0, 10);
	}, [followingCommunities, forums]);

	return (
		<Box display="flex" flexDirection="column" gap={2.5}>
			<H3Title> Suggested communities </H3Title>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={6} sx={{ gap: 2.5 }}>
					<CommunityCardSmallSkeleton />
				</ListSkeleton>
			) : topForums.length ? (
				topForums.map(forum => <CommunityCardSmall forum={forum} key={forum.idx} />)
			) : (
				<NotFound description="No communities" />
			)}
		</Box>
	);
};
