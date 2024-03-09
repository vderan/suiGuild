import { Box, Link, Skeleton } from '@mui/material';
import { Paragraph3 } from 'src/components/Typography';
import { Dialog } from 'src/components/Dialog';
import { useProfile } from 'src/hooks/useProfile';
import { MediumAvatar } from 'src/components/Avatar';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useMemo, useState } from 'react';
import { StandaloneInputField } from 'src/components/InputField';
import { IForum, UserInfo } from 'src/contexts';
import { styled } from '@mui/system';
import { NotFound } from 'src/components/NotFound';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { ListSkeleton } from 'src/components/Skeleton';
import { ErrorMessage } from 'src/components/ErrorMessage';

export const MembersModal = ({ isOpen, onClose, forum }: { isOpen: boolean; onClose: () => void; forum?: IForum }) => {
	const { getUserInfo } = useProfile();

	const [search, setSearch] = useState('');

	const {
		data: members,
		isLoading,
		error: isError
	} = useCustomSWR(forum?.idx ? 'getForumMembers' + forum.idx : null, async () => {
		if (!forum?.followers.length) return [];
		const data = await Promise.all(forum.followers.map(member => getUserInfo(member)));
		return data.flatMap(i => i || []);
	});

	const filteredMembers = useMemo(() => {
		if (!members) return [];
		return members.filter((user: UserInfo) => user.userInfo.some?.displayName.toLowerCase().includes(search));
	}, [members, search]);

	return (
		<Dialog
			open={isOpen}
			onClose={() => {
				onClose();
				setSearch('');
			}}
			title="Members"
			nofooter
		>
			<StandaloneInputField
				size="small"
				value={search}
				name="search"
				placeholder="Search members"
				disabled={isLoading}
				onChange={e => setSearch(e.target.value)}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					mt: 2,
					maxHeight: theme => theme.spacing(35),
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
					<ListSkeleton numberOfItems={3}>
						<MemberSkeleton />
					</ListSkeleton>
				) : filteredMembers.length ? (
					filteredMembers.map(user => <Member key={user.id} member={user} />)
				) : (
					<NotFound
						iconProps={{
							sx: {
								color: theme => theme.palette.dark[900]
							}
						}}
						description="No members"
					/>
				)}
			</Box>
		</Dialog>
	);
};

const Content = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	minHeight: theme.spacing(7),
	padding: theme.spacing(1.5, 0),
	'&:not(:last-child)': { borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}` }
}));

const Member = ({ member }: { member: UserInfo }) => {
	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (member && !member.isActive) {
			event.preventDefault();
			toast.warning('This user was deactivated!', { theme: 'colored' });
		}
	};
	return (
		<Content>
			<Link
				component={NavLink}
				to={`/profile/0x${member.userAddress}`}
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, overflow: 'hidden' }}
				onClick={handleClick}
			>
				{member.userInfo.some?.avatar.url && <MediumAvatar image={ipfsUrl(member.userInfo.some?.avatar.url)} />}
				<Paragraph3 color="text.secondary" noWrap>
					{member.userInfo.some?.displayName}
				</Paragraph3>
			</Link>
		</Content>
	);
};

const MemberSkeleton = () => {
	return (
		<Content>
			<Skeleton variant="circular" height={24} width={24} />
			<Skeleton variant="text" height={20} width="100%" />
		</Content>
	);
};
