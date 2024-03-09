import { Box } from '@mui/material';
import { CustomTabs, ITabs } from 'src/components/Tabs';
import { usePosts } from 'src/hooks';
import { forumTabsHashes } from 'src/constants/tab.constants';
import { FeedList } from './FeedList';
import { CommunitiesList } from './CommunitiesList';

export const Main = () => {
	const { data: posts, isLoading: isPostsLoading } = usePosts();

	const tabs: ITabs[] = [
		{
			label: 'Feed',
			startIcon: 'feed',
			countNum: isPostsLoading ? undefined : String(posts?.length || 0),
			hash: forumTabsHashes.feed,
			children: (
				<Box mt={2}>
					<FeedList />
				</Box>
			)
		},
		{
			label: 'Communities',
			startIcon: 'community',
			hash: forumTabsHashes.communities,
			children: (
				<Box mt={2}>
					<CommunitiesList />
				</Box>
			)
		}
	];

	return <CustomTabs tabs={tabs} />;
};
