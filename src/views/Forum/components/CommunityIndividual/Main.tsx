import { useContext } from 'react';
import { Box, BoxProps, Divider, Skeleton, Stack } from '@mui/material';
import { AuthContext, ColorModeContext, IForum } from 'src/contexts';
import { AboutCard } from './AboutCard';
import { TrendingPosts } from '../TrendingPosts';

import { RulesCard } from './RulesCard';
import { ResourcesCard } from './ResourcesCard';
import { CommunityIndividualPostList } from './CommunityIndividualPostList';
import { CommunityCreatePost } from './CommunityCreatePost';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

export const Main = ({
	forum,
	isLoading = false,
	isError = false,
	...props
}: { forum?: IForum; isLoading: boolean; isError: boolean } & BoxProps) => {
	const { theme } = useContext(ColorModeContext);
	const { profile } = useContext(AuthContext);
	const isOwner = `0x${forum?.creatorInfo}` === profile?.id;
	return (
		<Box
			{...props}
			sx={{
				display: 'grid',
				gridTemplateColumns: 'minmax(100px,1fr) 320px',
				gap: 2,
				[theme.breakpoints.down('lg')]: {
					gridTemplateColumns: 'minmax(100px,1fr)',
					gap: 5
				},
				...props.sx
			}}
		>
			<Stack sx={{ maxWidth: { xs: 'none', lg: '704px' }, width: '100%', mx: 'auto', gap: 3 }}>
				{isError && <ErrorMessage description="There was an error while loading" />}
				<CommunityCreatePost forum={forum} isLoading={isLoading} />
				<CommunityIndividualPostList />
			</Stack>

			<Box display="flex" flexDirection="column" gap={3}>
				{isLoading ? (
					<ListSkeleton numberOfItems={3} gap={2}>
						<>
							<Skeleton variant="rounded" width="100%" height={150} />
							<Divider sx={{ borderColor: theme => theme.palette.border.subtle }} />
						</>
					</ListSkeleton>
				) : forum ? (
					<>
						<AboutCard forum={forum} isOwner={isOwner} />
						<Divider sx={{ borderColor: theme => theme.palette.border.subtle }} />
						<RulesCard forum={forum} isOwner={isOwner} />
						<Divider sx={{ borderColor: theme => theme.palette.border.subtle }} />
						<ResourcesCard forum={forum} isOwner={isOwner} />
						<Divider sx={{ borderColor: theme => theme.palette.border.subtle }} />
					</>
				) : (
					<></>
				)}
				<TrendingPosts />
			</Box>
		</Box>
	);
};
