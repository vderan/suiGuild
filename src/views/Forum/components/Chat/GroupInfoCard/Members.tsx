import { Box, Skeleton, Stack, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import pluralize from 'pluralize';
import { useContext, useMemo, useState } from 'react';
import { Xmpp } from 'src/api/xmpp';
import { MediumAvatar } from 'src/components/Avatar';
import { IconButton } from 'src/components/IconButton';
import { StandaloneInputField } from 'src/components/InputField';
import { Menu, IMenu } from 'src/components/Menu';
import { RoomMembersSkeleton } from 'src/components/Skeleton';
import { PreTitle, Paragraph3 } from 'src/components/Typography';
import { AuthContext, ChatContext } from 'src/contexts';
import { getUsernameFromJid } from 'src/helpers/xmpp.helpers';
import { useBlockList } from 'src/hooks/useBlockedList';
import { useIsOwner } from 'src/hooks/useIsOwner';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { RoomMember } from 'src/types/Xmpp.types';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';

export const Members = () => {
	const { jid } = useContext(AuthContext);
	const { activeJid } = useContext(ChatContext);
	const { data: roomMembers, isLoading: roomMembersIsLoading } = useRoomMembers(activeJid);
	const { data: blockedList, isLoading: blockedListIsLoading, mutate } = useBlockList();
	const isOwner = useIsOwner(activeJid);

	const [isSearch, setIsSearch] = useState(false);
	const [search, setSearch] = useState('');

	const searchedRoomMembers = useMemo(() => {
		if (!roomMembers) {
			return [];
		}

		if (!search) {
			return roomMembers;
		}

		return roomMembers.filter(roomMember => roomMember.name.toLowerCase().includes(search.toLowerCase()));
	}, [roomMembers, search]);

	const handleOnBlockMember = async (memberJid: string) => {
		await Xmpp.block(memberJid);
		await mutate();
	};

	const handleOnUnblockMember = async (memberJid: string) => {
		await Xmpp.unBlock(memberJid);
		await mutate();
	};

	const handleOnKickMember = async (memberJid: string) => {
		await Xmpp.revokeMembership(activeJid, memberJid);
	};

	const membersLength = roomMembers?.length ?? 0;
	const isLoaded = !!roomMembers && !!blockedList && !roomMembersIsLoading && !blockedListIsLoading;

	return (
		<Box className="content-box">
			<Box className="member-box">
				{isSearch ? (
					<Stack direction="row" spacing={1} alignItems="center" width="100%">
						<IconButton icon="chevronLeft" onClick={() => setIsSearch(false)} />
						<StandaloneInputField
							name="search"
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search members"
						/>
					</Stack>
				) : (
					<>
						{isLoaded ? (
							<Paragraph3>
								{membersLength} {pluralize('member', membersLength)}
							</Paragraph3>
						) : (
							<Skeleton variant="text" width={100} height={17} />
						)}
						<Box className="inline-box">
							<IconButton icon="search" onClick={() => setIsSearch(true)} />
						</Box>
					</>
				)}
			</Box>
			<Box className="group-wrap">
				{isLoaded ? (
					<>
						{searchedRoomMembers.map(roomMember => (
							<Member
								key={roomMember.jid}
								roomMember={roomMember}
								isBlocked={!!blockedList?.includes(roomMember.jid)}
								isOwner={isOwner}
								isMe={getUsernameFromJid(roomMember.jid) === getUsernameFromJid(jid)}
								onToggleBlock={isBlocked => {
									if (isBlocked) {
										handleOnUnblockMember(roomMember.jid);
									} else {
										handleOnBlockMember(roomMember.jid);
									}
								}}
								onKick={handleOnKickMember}
							/>
						))}
					</>
				) : (
					<RoomMembersSkeleton />
				)}
			</Box>
		</Box>
	);
};

const Member = ({
	roomMember,
	isBlocked,
	isOwner,
	isMe,
	onToggleBlock,
	onKick
}: {
	roomMember: RoomMember;
	isBlocked: boolean;
	isOwner: boolean;
	isMe: boolean;
	onToggleBlock: (isBlocked: boolean) => void;
	onKick: (memberJid: string) => void;
}) => {
	const { getUserByName } = useProfile();
	const { data: user } = useCustomSWR('getUserByName' + roomMember.name, () => getUserByName(roomMember.name));

	const userAvatar = user?.userInfo.some?.avatar.url || '';

	const menu = useMemo(() => {
		const menu: IMenu[] = [
			{
				label: isBlocked ? 'Unblock user' : 'Block user',
				action: () => onToggleBlock(isBlocked)
			}
		];

		if (isOwner) {
			menu.push({
				label: 'Kick user',
				action: () => onKick(roomMember.jid)
			});
		}

		return menu;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBlocked, isOwner]);

	return (
		<Box className="group-box">
			<Link
				component={NavLink}
				to={`/profile/0x${user?.userAddress}`}
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					overflow: 'hidden',
					gap: 2,
				}}
			>
				<Box
					sx={{
						position: 'relative'
					}}
				>
					<MediumAvatar image={userAvatar ? ipfsUrl(userAvatar) : ''}>
						{roomMember.name.charAt(0).toUpperCase()}
					</MediumAvatar>
					{roomMember.affiliation === 'owner' ? (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'absolute',
								backgroundColor: theme => theme.palette.primary[900],
								borderRadius: '50%',
								width: 14,
								height: 14,
								bottom: 0,
								right: -5
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
								<path
									d="M2.08333 6.66699L1.25 2.08366L3.54167 4.16699L5 1.66699L6.45833 4.16699L8.75 2.08366L7.91667 6.66699H2.08333ZM7.91667 7.91699C7.91667 8.16699 7.75 8.33366 7.5 8.33366H2.5C2.25 8.33366 2.08333 8.16699 2.08333 7.91699V7.50033H7.91667V7.91699Z"
									fill="white"
								/>
							</svg>
						</Box>
					) : null}
				</Box>
				<Stack direction="column" spacing={0} overflow="hidden">
					<PreTitle noWrap>{roomMember.name}</PreTitle>
					{isMe && <Paragraph3>You</Paragraph3>}
					{isBlocked && <Paragraph3>Blocked</Paragraph3>}
				</Stack>
			</Link>
			{!isMe && (
				<Menu
					detail={{
						id: 'member-menu',
						label: (
							<IconButton
								icon="moreHorizontal"
								className="member-menu"
								sx={{
									opacity: 0,
								}}
							/>
						),
						menus: menu
					}}
				/>
			)}
		</Box>
	);
};
