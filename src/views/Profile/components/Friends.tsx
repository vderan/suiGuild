import { Grid, Skeleton } from '@mui/material';
import { NotFound } from 'src/components/NotFound';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { FriendCard } from './FriendCard';
import { AddFriends } from 'src/components/AddFriends';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';
import { AuthContext } from 'src/contexts';
import { useContext } from 'react';

export const Friends = ({ userId }: { userId?: string }) => {
	const { profile } = useContext(AuthContext);

	const { getUserInfo, getUserByName } = useProfile();

	const {
		data: friends,
		isLoading,
		error: isError
	} = useCustomSWR('getFriends' + userId, async () => {
		const user = await getUserInfo(userId);
		if (!user?.friends.length) return [];
		const data = await Promise.all(user.friends.map(username => getUserByName(username)));
		return data.flatMap(i => (i ? i : []));
	});
	const isOwner = profile?.id === userId;

	return (
		<Grid container spacing={{ xs: 4, lg: 10.625 }}>
			<Grid item xs={12} lg={8.223}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : isLoading ? (
					<ListSkeleton numberOfItems={2} sx={{ gap: 2, flexDirection: { xs: 'column', lg: 'row' } }}>
						<Skeleton variant="rounded" width="100%" height={200} />
					</ListSkeleton>
				) : friends?.length ? (
					<Grid container spacing={2}>
						{friends.map(friend => (
							<Grid key={friend.id} item xs={12} lg={6}>
								<FriendCard friend={friend} isOwner={isOwner} />
							</Grid>
						))}
					</Grid>
				) : (
					<NotFound description="No friends" />
				)}
			</Grid>

			<Grid item xs={12} lg={3.777}>
				<AddFriends />
			</Grid>
		</Grid>
	);
};
