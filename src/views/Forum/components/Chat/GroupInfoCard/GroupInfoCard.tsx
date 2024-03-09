import { styled } from '@mui/system';
import { Box, Divider, Skeleton, Stack } from '@mui/material';
import { Paragraph2, Subtitle, Label, Paragraph3 } from 'src/components/Typography';
import { AuthContext, ChatContext } from 'src/contexts';
import { CustomAvatar, LargeAvatar } from 'src/components/Avatar';
import { IconButton } from 'src/components/IconButton';
import { useContext, useMemo, useState } from 'react';
import { useRoomInfo } from 'src/hooks/useRoomInfo';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { useRoomVCard } from 'src/hooks/useRoomAvatar';
import { Icon } from 'src/components/Icon';
import { SharedMedia } from './SharedMedia';
import { Members } from './Members';
import { useIsOwner } from 'src/hooks/useIsOwner';
import pluralize from 'pluralize';
import { GroupForm } from '../GroupForm';
import { Xmpp } from 'src/api/xmpp';
import { getUsernameFromJid, removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { QuaternaryButton, SecondaryButton } from 'src/components/Button';
import { useBlockList } from 'src/hooks/useBlockedList';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { Dialog } from 'src/components/Dialog';
import { useProfile } from 'src/hooks/useProfile';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import useSWR, { useSWRConfig } from 'swr';
import { differenceDate } from 'src/helpers/date.helpers';
import { toBareJid } from 'src/helpers/xmpp.helpers';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { toast } from 'react-toastify';
import { ChatHeader } from '../ChatHeader';
import { MutualGroups } from './MutualGroups';
import { ErrorHandler } from 'src/helpers';

export const GroupInfoCard = () => {
	const { activeJid, chatOpen, infoOpen, setSideBarOpen } = useContext(ChatContext);
	const { data: vCard } = useRoomVCard(activeJid);
	const isOwner = useIsOwner(activeJid);

	const isRoom = !vCard?.role || vCard.role === 'ROOM';

	return (
		<StyledBox>
			<Box className="cardStyle groupInfoCard">
				{chatOpen && infoOpen && <ChatHeader />}
				<Box
					sx={{
						height: chatOpen ? theme => theme.spacing(48.25) : '100%',
						overflowY: 'auto'
					}}
				>
					{!isRoom ? <DMCard onSideBarClose={() => setSideBarOpen(false)} /> : null}
					{isRoom ? (
						<>
							<RoomCard onSideBarClose={() => setSideBarOpen(false)} />
							<Divider sx={theme => ({ mx: 2, borderStyle: 'solid', borderColor: theme.palette.border.subtle })} />
							<Members />
						</>
					) : null}
					<Divider sx={theme => ({ mx: 2, borderStyle: 'solid', borderColor: theme.palette.border.subtle })} />
					{!isRoom && <MutualGroups />}
					{!isRoom && (
						<Divider sx={theme => ({ mx: 2, borderStyle: 'solid', borderColor: theme.palette.border.subtle })} />
					)}
					<SharedMedia onClose={() => setSideBarOpen(false)} />
					{!infoOpen && (
						<Divider sx={theme => ({ mx: 2, borderStyle: 'solid', borderColor: theme.palette.border.subtle })} />
					)}
					{!infoOpen && <BlockCard />}
				</Box>
			</Box>
			{isOwner && !infoOpen && <SuggestionCard />}
		</StyledBox>
	);
};

const StyledBox = styled(Box)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	[theme.breakpoints.up('lg')]: {
		paddingLeft: theme.spacing(2)
	},
	'& .cardStyle': {
		background: theme.palette.dark[700],
		backdropFilter: `blur(${theme.spacing(2.75)})`,
		border: `${theme.spacing(0.125)} solid ${theme.palette.dark[700]}`,
		borderRadius: theme.shape.borderRadius
	},
	'& .groupInfoCard': {
		'& .headerBg': {
			position: 'relative',
			display: 'flex',
			alignItems: 'center',
			width: '100%',
			height: '88px',
			borderTopLeftRadius: theme.spacing(1.5),
			borderTopRightRadius: theme.spacing(1.5)
		},
		'& .profile': {
			display: 'flex',
			flexDirection: 'column',
			transform: 'translateY(-50%)',
			overflow: 'hidden',
			position: 'absolute',
			top: theme.spacing(5.5),
			left: theme.spacing(10)
		},
		'& .content-box': {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(1.5),
			margin: theme.spacing(2, 2.125),
			'& .member-box': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between'
			},
			'& .group-wrap': {
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(1.5),
				maxHeight: '300px',
				overflow: 'auto',
				'& .group-box': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					textAlign: 'left',
					'&:hover': {
						'& .member-menu': {
							opacity: 1
						}
					}
				}
			},
			'& .inline-box': {
				display: 'flex',
				alignItems: 'center',
				gap: theme.spacing(1)
			}
		}
	},
	'& .suggestionCard': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2),
		padding: theme.spacing(2),
		'& .suggestionCardItem': {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			'& .userInfo': {
				display: 'flex',
				flexDirection: 'row',
				gap: theme.spacing(1),
				justifyContent: 'flex-start',
				alignItems: 'center'
			}
		}
	}
}));

const BlockCard = () => {
	const { jid } = useContext(AuthContext);
	const { activeJid } = useContext(ChatContext);
	const [open, setOpen] = useState(false);
	const { mutate: swrMutate } = useSWRConfig();

	const { data: blockedList, isLoading: blockedListIsLoading, mutate } = useBlockList();
	const { data: roomMembers, isLoading: roomMembersIsLoading } = useRoomMembers(activeJid);
	// Find the roommember that is not the current user (the other user)
	// There will only be one other user in a DM
	const roomMember = useMemo(() => {
		return roomMembers?.find(member => member.jid !== removeResourceFromJid(jid));
	}, [jid, roomMembers]);

	const isBlocked = roomMember && !!blockedList?.includes(roomMember.jid);
	const isLoaded = !!blockedList && !blockedListIsLoading && !!roomMembers && !roomMembersIsLoading;

	const handleUserBlock = async () => {
		try {
			if (!roomMember) {
				return;
			}

			if (isBlocked) {
				await Xmpp.unBlock(roomMember.jid);
			} else {
				await Xmpp.block(roomMember.jid);
			}
			swrMutate(await mutate([QUERY_KEYS.XMPP_ROOM_MEMBERS, activeJid]));
			await mutate();
			setOpen(false);
		} catch (e) {
			ErrorHandler.process(e);
		}
	};

	return (
		<div className="content-box">
			{isLoaded ? (
				roomMember ? (
					<SecondaryButton startIcon="block" onClick={() => setOpen(true)}>
						{isBlocked ? 'Unblock user' : 'Block user'}
					</SecondaryButton>
				) : (
					<></>
				)
			) : (
				<Skeleton variant="rounded" height={34} />
			)}
			<Dialog
				width="dialogExtraSmall"
				open={open}
				title={`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`}
				isConfirmation
				onClose={() => setOpen(false)}
				onConfirm={handleUserBlock}
				onConfirmText={`Yes,  ${isBlocked ? 'Unblock' : 'Block'}`}
				onCancelText="Cancel"
			/>
		</div>
	);
};

const DMCard = ({ onSideBarClose }: { onSideBarClose: () => void }) => {
	const { jid } = useContext(AuthContext);
	const { activeJid, infoOpen } = useContext(ChatContext);
	const { getUserByName } = useProfile();

	const { data: roomMembers, isLoading: roomMembersIsLoading } = useRoomMembers(activeJid);
	// Find the roommember that is not the current user (the other user)
	// There will only be one other user in a DM
	const roomMember = useMemo(() => {
		return roomMembers?.find(member => member.jid !== removeResourceFromJid(jid));
	}, [jid, roomMembers]);

	const { data: lastActivity, error: lastActivityError } = useSWR(
		'getLastActivity' + roomMember?.jid,
		() => Xmpp.getLastActivity(roomMember?.jid || ''),
		{ refreshInterval: 10000 }
	);

	const { data: user } = useCustomSWR('getUserByName' + roomMember?.name, () => getUserByName(roomMember?.name));
	const avatarUrl = user?.userInfo.some?.avatar.url || '';

	const isLoaded = !!roomMembers && !roomMembersIsLoading;

	return (
		<>
			<Stack direction="row" padding={2} gap={1} justifyContent="space-between">
				<Stack direction="row" alignItems="center" gap={1} overflow="hidden">
					<CustomAvatar
						image={avatarUrl ? ipfsUrl(avatarUrl) : ''}
						sx={{
							width: theme => theme.spacing(7),
							height: theme => theme.spacing(7)
						}}
					>
						<Icon icon="users" />
					</CustomAvatar>
					<Stack overflow="hidden">
						{isLoaded ? (
							<>
								<Subtitle noWrap>@{getUsernameFromJid(roomMember?.jid ?? '')}</Subtitle>
								{!lastActivityError ? (
									<Paragraph2 color="text.secondary">
										{lastActivity === '0' ? 'Online' : `Last seen ${differenceDate(Date.now() - lastActivity * 1000)}`}
									</Paragraph2>
								) : (
									<></>
								)}
							</>
						) : (
							<>
								<Skeleton variant="text" width={100} height={20} />
								<Skeleton variant="text" height={20} />
							</>
						)}
					</Stack>
				</Stack>
				{!infoOpen && (
					<Stack flexDirection="row" alignItems="center" justifyContent="flex-end">
						<IconButton icon="chevronLeft" onClick={onSideBarClose} />
					</Stack>
				)}
			</Stack>
		</>
	);
};

const RoomCard = ({ onSideBarClose }: { onSideBarClose: () => void }) => {
	const [editGroupOpen, setEditGroupOpen] = useState(false);

	const { activeJid, infoOpen } = useContext(ChatContext);
	const { data: vCard, isLoading: avatarIsLoading } = useRoomVCard(activeJid);
	const { data: roomInfo, isLoading: roomInfoIsLoading } = useRoomInfo(activeJid);
	const { data: roomMembers, isLoading: roomMembersIsLoading } = useRoomMembers(activeJid);

	const isOwner = useIsOwner(activeJid);
	const membersLength = roomMembers?.length ?? 0;

	const isLoaded =
		!!roomInfo && !!vCard && !!roomMembers && !roomInfoIsLoading && !avatarIsLoading && !roomMembersIsLoading;

	return (
		<>
			<Box className={infoOpen ? 'chatHeaderBg' : 'headerBg'}>
				<Box>
					<CustomAvatar
						image={vCard?.avatar ? ipfsUrl(vCard?.avatar) : ''}
						sx={{
							width: theme => theme.spacing(7),
							height: theme => theme.spacing(7),
							position: 'absolute',
							top: theme => theme.spacing(2),
							left: theme => theme.spacing(2)
						}}
					>
						<Icon icon="users" />
					</CustomAvatar>
					<Box className="profile">
						<Subtitle>Group</Subtitle>
						{isLoaded ? (
							<Paragraph2 noWrap color="text.secondary">
								{membersLength} {pluralize('member', membersLength)}
							</Paragraph2>
						) : (
							<Skeleton variant="text" width={100} height={20} />
						)}
					</Box>
				</Box>
				<Stack
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
					sx={{
						width: '100%',
						px: 1
					}}
				>
					{isOwner && <IconButton icon="edit" onClick={() => setEditGroupOpen(true)} />}
					{!infoOpen && <IconButton icon="chevronLeft" onClick={onSideBarClose} />}
				</Stack>
			</Box>
			<Box sx={{ padding: theme => theme.spacing(0, 2, 2, 2) }}>
				{isLoaded ? (
					<Paragraph2 sx={{ wordBreak: 'break-word' }}>{roomInfo?.description ?? '-'}</Paragraph2>
				) : (
					<Skeleton variant="text" height={20} />
				)}
			</Box>
			<GroupForm
				open={editGroupOpen}
				onClose={() => setEditGroupOpen(false)}
				defaultValues={{
					name: roomInfo?.name ?? '',
					description: roomInfo?.description ?? '',
					avatar: vCard?.avatar ?? ''
				}}
				onSubmit={async data => {
					let fileHash = '';

					if (data.avatar) {
						const avatarName = data.name + '-avatar';
						fileHash = await uploadAttachment(data.avatar, avatarName);
					}

					await Xmpp.setRoomVCard({ roomJid: activeJid, avatar: fileHash, roomRole: 'ROOM' });
					await Xmpp.editRoomName(activeJid, data.name, data.description);
				}}
			/>
		</>
	);
};

const SuggestionCard = () => {
	const { profile } = useContext(AuthContext);
	const { activeJid } = useContext(ChatContext);
	const { data: roomMembers } = useRoomMembers(activeJid);

	const members = useMemo(() => {
		if (!profile || !profile.friends || !roomMembers) return [];

		return profile.friends.filter(username => !roomMembers.some(member => member.name === username));
	}, [profile, roomMembers]);

	return (
		members.length > 0 && (
			<Box className="cardStyle suggestionCard">
				<Paragraph3>Suggestions</Paragraph3>
				{members.map((member: string) => (
					<MemberInfo key={member} username={member} />
				))}
			</Box>
		)
	);
};

const MemberInfo = ({ username }: { username: string }) => {
	const { getUserByName } = useProfile();
	const { data: user, isLoading } = useCustomSWR('getUserByName' + username, () => getUserByName(username));
	const { activeJid } = useContext(ChatContext);
	const { data: vCard } = useRoomVCard(activeJid);
	const { data: roomMembers } = useRoomMembers(activeJid);

	const [isAdding, setIsAdding] = useState(false);

	const addToChat = async () => {
		if (!vCard || !roomMembers) {
			return;
		}
		setIsAdding(true);
		try {
			await Xmpp.inviteUser(activeJid, toBareJid(username));
			if (vCard.role === 'DM') {
				await Xmpp.setRoomVCard({
					roomJid: activeJid,
					avatar: vCard.avatar,
					roomRole: 'ROOM'
				});
				await Xmpp.editRoomName(activeJid, [...roomMembers.map(roomMember => roomMember.name), username].join(', '));
			}
		} catch (error) {
			toast.error((error as Error).message, { theme: 'colored' });
		}
		setIsAdding(false);
	};

	return user && !user.isActive ? null : (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', gap: 1 }}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: 1,
					overflow: 'hidden'
				}}
			>
				{isLoading ? (
					<Skeleton variant="circular" width={32} height={32} />
				) : (
					<LargeAvatar image={user?.userInfo.some?.avatar.url ? ipfsUrl(user?.userInfo.some.avatar.url) : ''} />
				)}
				<Label fontWeight={700} noWrap>
					{username}
				</Label>
			</Box>
			<QuaternaryButton
				sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase' }}
				onClick={addToChat}
				loading={isAdding}
			>
				Add to chat
			</QuaternaryButton>
		</Box>
	);
};
