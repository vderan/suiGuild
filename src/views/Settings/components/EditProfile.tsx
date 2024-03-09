import { useContext, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { H3Title } from 'src/components/Typography';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { editProfileSchema } from 'src/schemas/setting.schema';
import { AuthContext, ChatContext } from 'src/contexts';
import { useGilder } from 'src/hooks/useGilder';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { IEditUserProps } from 'src/hooks/types';
import { avatarUrl, coverUrl } from 'src/constants/images.constants';
import { LanguageSelector } from 'src/components/LanguageSelector';
import { CountrySelector } from 'src/components/CountrySelector';
import { toast } from 'react-toastify';
import { Xmpp } from 'src/api/xmpp';
import { useSWRConfig } from 'swr';
import { QUERY_KEYS } from 'src/constants/querykeys.constants';
import { removeResourceFromJid } from 'src/helpers/xmpp.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { FileField } from 'src/components/FileField';
import { ErrorHandler } from 'src/helpers';

interface EditProfileForm {
	avatar: string;
	cover: string;
	name: string;
	bio: string;
	country: string;
	language: string;
	website: string;
}

export const EditProfile = () => {
	const profileFormRef = useRef<null | HTMLFormElement>(null);
	const { editPersonalInfo } = useGilder();
	const [isUploading, setIsUploading] = useState(false);

	const { activeJid, setMessages } = useContext(ChatContext);
	const { profile, jid, loadUserInfo } = useContext(AuthContext);
	const { mutate } = useSWRConfig();

	// TODO: refactor

	const handleEditProfile = async (data: EditProfileForm) => {
		setIsUploading(true);

		let avatar = '';
		let cover = '';

		if (!data.avatar) {
			avatar = profile?.avatar || avatarUrl;
		}
		// Skip if the avatar is the default one
		else if (data.avatar !== avatarUrl) {
			try {
				avatar = await uploadAttachment(data.avatar, 'avatar');
			} catch (error) {
				setIsUploading(false);
				ErrorHandler.process(error);

				return;
			}
		} else {
			avatar = avatarUrl;
		}
		// Also set the avatar in xmpp
		await Xmpp.setUserVCard(avatar);
		await mutate([QUERY_KEYS.XMPP_USER_VCARD, removeResourceFromJid(jid)]);
		// update avatar in messages
		setMessages({});
		activeJid && (await mutate([QUERY_KEYS.XMPP_ROOM_MEMBERS, activeJid]));

		if (!data.cover) {
			cover = profile?.coverImage || coverUrl;
		}
		// Skip if the cover is the default one
		else if (data.cover !== coverUrl) {
			try {
				cover = await uploadAttachment(data.cover, 'cover');
			} catch (error) {
				setIsUploading(false);
				ErrorHandler.process(error);

				return;
			}
		} else {
			cover = coverUrl;
		}

		const editUserInfo: IEditUserProps = {
			avatar: avatar,
			coverImage: cover,
			name: data?.name || '',
			displayName: profile?.displayName || '',
			email: profile?.email || '',
			bio: data.bio || '',
			nation: data.country || '',
			language: data.language || '',
			website: data.website || '',
			socialLinks: profile?.socialLinks || ''
		};

		try {
			await editPersonalInfo(editUserInfo);
			await loadUserInfo();
			toast.success('Updated user successfully!', { theme: 'colored' });
		} catch (error) {
			ErrorHandler.process(error);
		}

		setIsUploading(false);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(3) }}>
			<Form<EditProfileForm>
				action={handleEditProfile}
				defaultValues={{
					avatar: ipfsUrl(profile?.avatar ?? avatarUrl),
					cover: ipfsUrl(profile?.coverImage ?? coverUrl),
					name: profile?.name || '',
					bio: profile?.bio,
					country: profile?.nation,
					language: profile?.language,
					website: profile?.website
				}}
				myRef={profileFormRef}
				schema={editProfileSchema}
			>
				<Box className="setting-box">
					<H3Title>Media</H3Title>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<FileField maxSize={2} name="avatar" label="Avatar" btnLabel="Upload avatar" />
						<FileField maxSize={5} name="cover" label="Cover" btnLabel="Upload cover" isFullWidth />
					</Box>
				</Box>
				<Box className="setting-box">
					<H3Title>About</H3Title>
					<InputField name="name" label="Display name" placeholder="gamerxyz" maxLength={30} />
					<InputField name="bio" label="Bio" placeholder="Just a regular player" maxLength={200} multiline />
					<Box sx={{ display: 'flex', gap: theme => theme.spacing(1.5) }}>
						<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(1.5) }}>
							<CountrySelector />
						</Box>
						<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(1.5) }}>
							<LanguageSelector />
						</Box>
					</Box>
					<InputField name="website" label="Website" placeholder="https://gamerxyz.com" />
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.25 }}>
					<PrimaryButton
						onClick={() =>
							profileFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
						}
						loading={isUploading}
						sx={{ width: 'auto' }}
					>
						Save changes
					</PrimaryButton>
					<SecondaryButton
						onClick={() =>
							profileFormRef.current?.dispatchEvent(new Event('reset', { cancelable: true, bubbles: true }))
						}
						disabled={isUploading}
						sx={{ width: 'auto' }}
					>
						Cancel
					</SecondaryButton>
				</Box>
			</Form>
		</Box>
	);
};
