import { FormHelperText, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { MediumAvatar } from 'src/components/Avatar';
import { PrimaryButton } from 'src/components/Button';
import { IconButton } from 'src/components/IconButton';
import { Paragraph3 } from 'src/components/Typography';
import { UsernameSelector } from 'src/components/UsernameSelector';
import { AuthContext, ChatContext, UserInfo } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useGilder } from 'src/hooks/useGilder';
import { useProfile } from 'src/hooks/useProfile';

const FriendInfo = ({
	username,
	onClick,
	disabled = false
}: {
	username: string;
	onClick: (username: string) => void;
	disabled?: boolean;
}) => {
	const { getUserByName } = useProfile();
	const { data: user, isLoading } = useCustomSWR('getUserByName' + username, () => getUserByName(username));

	return user?.isActive ? (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: theme => theme.spacing(1.25, 0),
				'&:not(:last-child)': {
					borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`
				}
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
				{isLoading ? (
					<Skeleton variant="circular" width={30} height={30} />
				) : (
					<MediumAvatar image={user?.userInfo.some?.avatar.url ? ipfsUrl(user?.userInfo.some?.avatar.url) : ''} />
				)}
				<Paragraph3 color="text.secondary" noWrap>
					{username}
				</Paragraph3>
			</Box>
			<PrimaryButton
				sx={{ width: 'auto', '&:hover': { boxShadow: 'none' } }}
				onClick={() => onClick(username)}
				disabled={disabled}
			>
				Add
			</PrimaryButton>
		</Box>
	) : null;
};

export const Members = ({
	disabled = false,
	onChange,
	customFilter,
	customFriendFilter
}: {
	disabled: boolean;
	onChange?: (members: string[]) => void;
	customFilter?: (username: UserInfo) => boolean;
	customFriendFilter?: (username: string) => boolean;
}) => {
	const { profile } = useContext(AuthContext);
	const { conversationOpen } = useContext(ChatContext);
	const { getUserByName } = useProfile();
	const { getUsernames } = useGilder();

	const { field: membersField, fieldState: membersFieldState } = useController<Record<string, string[]>>({
		name: 'members'
	});
	const { field: memberField, fieldState: memberFieldState } = useController<Record<string, string>>({
		name: 'member'
	});
	const [isMemberAdding, setIsMemberAdding] = useState(false);

	const { data: usernames, isLoading } = useCustomSWR(
		'getMembersUsernames',
		async () => {
			const _usernames = await getUsernames();
			if (!_usernames) return [];
			const data = await Promise.all(_usernames?.map(username => getUserByName(username)));
			return data
				.filter(i => (customFilter ? i?.isActive && customFilter?.(i) : i?.isActive))
				.flatMap(i => i?.userInfo.some?.displayName || []);
		},
		{ refreshInterval: 0 }
	);

	const checkIsMemberAdded = useCallback(
		(member: string) => membersField.value.some(user => user === member),
		[membersField.value]
	);

	const filteredUsernames = useMemo(() => {
		return usernames?.filter(user => !checkIsMemberAdded(user)) || [];
	}, [usernames, checkIsMemberAdded]);

	const handleAddOrRemoveMembers = (member: string) => {
		const isAdded = checkIsMemberAdded(member);
		const value = isAdded
			? [...membersField.value.filter((user: string) => user !== member)]
			: [...membersField.value, member];

		membersField.onChange(value);
		onChange?.(value);
	};

	const friends = (() => {
		if (!profile?.friends?.length) return [];
		return profile.friends.filter(user =>
			customFriendFilter ? customFriendFilter?.(user) && !checkIsMemberAdded(user) : !checkIsMemberAdded(user)
		);
	})();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: theme => (conversationOpen ? theme.spacing(2, 2, 5, 2) : 0),
				width: '100%'
			}}
		>
			<UsernameSelector
				usernames={filteredUsernames}
				name="member"
				disabled={isMemberAdding || disabled}
				isLoading={isLoading}
				onChange={async (e, value) => {
					e.preventDefault();
					setIsMemberAdding(true);
					const val = value?.id;
					if (val && !memberFieldState.invalid) {
						const isAdded = checkIsMemberAdded(val);
						if (!isAdded) {
							const value = [...membersField.value, val];
							membersField.onChange(value);
							onChange?.(value);
						}
					}
					memberField.onChange('');
					setIsMemberAdding(false);
				}}
			/>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					maxHeight: theme => theme.spacing(15),
					overflowY: 'auto'
				}}
			>
				{friends.map(username => (
					<FriendInfo disabled={disabled} key={username} username={username} onClick={handleAddOrRemoveMembers} />
				))}
			</Box>
			{membersField.value.length ? (
				<Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexDirection: 'column' }}>
					<Paragraph3>Selected users</Paragraph3>
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
						{membersField.value.map((member: string) => (
							<MemberInfo
								key={member}
								memberAddress={member}
								onClick={memberAddress => handleAddOrRemoveMembers(memberAddress)}
								disabled={disabled}
							/>
						))}
					</Box>
				</Box>
			) : null}
			{membersFieldState.error?.message && (
				<FormHelperText sx={{ margin: '0!important' }} error>
					{membersFieldState.error.message}
				</FormHelperText>
			)}
		</Box>
	);
};

const MemberInfo = ({
	memberAddress,
	onClick,
	disabled = false
}: {
	memberAddress: string;
	onClick: (memberAdress: string) => void;
	disabled: boolean;
}) => {
	const { getUserByName } = useProfile();
	const { data: user, isLoading } = useCustomSWR('getUserByName' + memberAddress, () => getUserByName(memberAddress));

	return (
		<Box
			sx={{
				width: 'auto',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 1,
				background: theme => theme.palette.gradient2.main,
				padding: theme => theme.spacing(0.625, 1.25),
				borderRadius: theme => theme.spacing(1),
				overflow: 'hidden'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					overflow: 'hidden'
				}}
			>
				{isLoading ? (
					<Skeleton variant="circular" width={32} height={32} />
				) : (
					<MediumAvatar image={user?.userInfo.some?.avatar.url ? ipfsUrl(user?.userInfo.some.avatar.url) : ''} />
				)}
				<Paragraph3 noWrap>{memberAddress}</Paragraph3>
			</Box>
			<IconButton disabled={disabled} icon="close" size="small" onClick={() => onClick(memberAddress)} />
		</Box>
	);
};
