import { Box } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { useSocketEmit } from 'use-socket-io-react';
import { Paragraph2, ButtonMediumText } from 'src/components/Typography';
import { useGilder } from 'src/hooks/useGilder';
import { Dialog } from 'src/components/Dialog';
import { AuthContext, UserInfo } from 'src/contexts';
import { StandaloneInputField } from 'src/components/InputField';
import { SmallAvatar } from 'src/components/Avatar';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { toast } from 'react-toastify';
import { ErrorHandler } from 'src/helpers';
import { SecondaryButton } from '../Button';
import { useActiveUsers } from 'src/hooks';
import { ErrorMessage } from '../ErrorMessage';
import { ListSkeleton, FriendCardSkeleton } from '../Skeleton';
import { NotFound } from '../NotFound';

export const AddFriendsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { profile } = useContext(AuthContext);

	const { data: _users, isLoading, error: isError } = useActiveUsers();
	const [search, setSearch] = useState('');

	const users = useMemo(() => {
		if (!_users) return [];
		const availableFriends = _users.filter(user => profile?.displayName !== user.userInfo.some?.displayName);
		return availableFriends.filter(user => user.userInfo.some?.displayName.toLowerCase().includes(search));
	}, [search, _users, profile]);

	return (
		<Dialog
			open={isOpen}
			onClose={() => {
				onClose();
				setSearch('');
			}}
			title="People you may know"
			nofooter
		>
			<StandaloneInputField
				value={search}
				size="small"
				name="search"
				required
				placeholder="Search users"
				onChange={e => setSearch(e.target.value)}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					mt: 2,
					maxHeight: theme => theme.spacing(24),
					overflowY: 'auto'
				}}
			>
				{isError ? (
					<ErrorMessage
						iconProps={{
							sx: {
								color: theme => theme.palette.dark[900]
							}
						}}
						description="There was an error while loading"
					/>
				) : isLoading ? (
					<ListSkeleton numberOfItems={4}>
						<FriendCardSkeleton />
					</ListSkeleton>
				) : users.length ? (
					users.map((user, index) => <FriendInfo key={user.id + index} user={user} />)
				) : (
					<NotFound
						iconProps={{
							sx: {
								color: theme => theme.palette.dark[900]
							}
						}}
						description="No users"
					/>
				)}
			</Box>
		</Dialog>
	);
};

const FriendInfo = ({ user }: { user: UserInfo }) => {
	const { profile, loadUserInfo } = useContext(AuthContext);
	const { emit } = useSocketEmit();
	const { sendFriendRequest } = useGilder();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const profileFriends = [
		...(profile?.friends || []),
		...(profile?.sentRequests || []),
		...(profile?.receivedRequests || [])
	];

	const addFriend = async () => {
		const username = user?.userInfo.some?.displayName;
		if (!profile?.displayName || !username) {
			toast.warning("Username doesn't exist", { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			await sendFriendRequest(username, profile.displayName);
			emit('friend_request_sent', [{ from: profile.displayName, to: username, type: 'friend-request' }]);
			await loadUserInfo();
		} catch (error) {
			ErrorHandler.process(error);
		}
		setIsSubmitting(false);
	};
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 1,
					minHeight: theme => theme.spacing(7),
					padding: theme => theme.spacing(2, 0),
					'&:not(:last-child)': {
						borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
					}
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, overflow: 'hidden' }}>
					<SmallAvatar image={user?.userInfo.some?.avatar.url ? ipfsUrl(user.userInfo.some.avatar.url) : ''} />

					<Paragraph2 color="text.secondary" noWrap>
						{user?.userInfo.some?.displayName}
					</Paragraph2>
				</Box>
				{profileFriends.includes(user.userInfo.some?.displayName || '') ? (
					<ButtonMediumText whiteSpace="nowrap" color={theme => theme.palette.success.main}>
						Invite Sent
					</ButtonMediumText>
				) : (
					<SecondaryButton loading={isSubmitting} startIcon="add" size="small" onClick={addFriend} />
				)}
			</Box>
		</>
	);
};
