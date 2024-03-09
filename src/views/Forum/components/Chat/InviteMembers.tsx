import { Stack } from '@mui/material';
import { useContext, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Xmpp } from 'src/api/xmpp';
import { MediumAvatar } from 'src/components/Avatar';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { Icon } from 'src/components/Icon';
import { PreTitle } from 'src/components/Typography';
import { AuthContext } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getUsernameFromJid, toBareJid } from 'src/helpers/xmpp.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { useRoomVCard } from 'src/hooks/useRoomAvatar';
import { useRoomInfo } from 'src/hooks/useRoomInfo';
import { useRoomMembers } from 'src/hooks/useRoomMembers';
import { Members } from './ChatCard/Members';
import { inviteMembersSchema } from 'src/schemas/invite-membets.schema';

interface InviteMembersFormData {
	member: string;
	members: string[];
}

export const InviteMembers = ({ roomJid, open, onClose }: { roomJid: string; open: boolean; onClose: () => void }) => {
	const { jid } = useContext(AuthContext);
	const { getUserByName } = useProfile();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [members, setMembers] = useState<string[]>([]);
	const formRef = useRef<null | HTMLFormElement>(null);

	const { data: roomInfo } = useRoomInfo(roomJid);
	const { data: vCard } = useRoomVCard(roomJid);
	const { data: roomMembers } = useRoomMembers(roomJid);

	const isRoom = !vCard?.role || vCard.role === 'ROOM';

	const roomMember = useMemo(() => {
		if (isRoom || !roomMembers) return undefined;

		return roomMembers.find(member => member.name !== getUsernameFromJid(jid));
	}, [isRoom, jid, roomMembers]);

	const { data: user } = useCustomSWR('getUserByName' + roomMember?.name, () => getUserByName(roomMember?.name));

	const handleOnFormSubmit = async (data: InviteMembersFormData) => {
		if (!vCard || !roomMembers) {
			return;
		}

		setIsSubmitting(true);

		try {
			await Promise.all(data.members.map(member => Xmpp.inviteUser(roomJid, toBareJid(member))));
			if (vCard.role === 'DM') {
				// Incase of new members invites to a DM, we convert it to a group chat
				await Xmpp.setRoomVCard({
					roomJid,
					avatar: vCard.avatar,
					roomRole: 'ROOM'
				});

				await Xmpp.editRoomName(
					roomJid,
					[...roomMembers.map(roomMember => roomMember.name), ...data.members].join(', ')
				);
			}
		} catch (error) {
			toast.error((error as Error).message, { theme: 'colored' });
		}
		setIsSubmitting(false);
		onClose();
		setMembers([]);
	};

	const checkIsMemberExist = (memberName: string) => {
		const isMember = roomMembers?.find(i => i.name === memberName);
		return isMember;
	};

	const avatar = !isRoom && user?.userInfo.some?.avatar.url ? user?.userInfo.some?.avatar.url : vCard?.avatar;

	return (
		<Dialog
			title="Invite new members"
			open={open}
			onClose={() => {
				onClose();
				setMembers([]);
			}}
			onConfirm={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			onConfirmText={members.length > 1 ? 'Send invites' : 'Send invite'}
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Stack direction="column" spacing={1}>
				<Stack direction="row" alignItems="center" spacing={1.25}>
					<MediumAvatar image={avatar ? ipfsUrl(avatar) : ''}>
						<Icon icon="users" />
					</MediumAvatar>
					<PreTitle fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
						{roomInfo?.name}
					</PreTitle>
				</Stack>
				<Form<InviteMembersFormData>
					action={handleOnFormSubmit}
					mode="onChange"
					defaultValues={{
						member: '',
						members: []
					}}
					myRef={formRef}
					schema={inviteMembersSchema}
				>
					<Members
						disabled={isSubmitting}
						onChange={members => setMembers(members)}
						customFilter={member => !checkIsMemberExist(member.userInfo.some?.displayName || '')}
						customFriendFilter={member => !checkIsMemberExist(member)}
					/>
				</Form>
			</Stack>
		</Dialog>
	);
};
