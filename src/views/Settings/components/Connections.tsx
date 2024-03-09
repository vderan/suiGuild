import { Box } from '@mui/material';
import { useContext, useMemo, useRef, useState } from 'react';
import { H3Title } from 'src/components/Typography';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { socialSchema } from 'src/schemas/social-schema';
import { IEditUserProps } from 'src/hooks/types';
import { AuthContext } from 'src/contexts';
import { useGilder } from 'src/hooks/useGilder';
import { socials } from 'src/constants/socials.constants';
import { toast } from 'react-toastify';
import { ErrorHandler } from 'src/helpers';

interface ConnectionForm {
	twitter: string;
	youtube: string;
	instagram: string;
	facebook: string;
	twitch: string;
	tiktok: string;
	steam: string;
	discord: string;
}

export const Connections = () => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const { profile, loadUserInfo } = useContext(AuthContext);
	const { editPersonalInfo } = useGilder();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const profileSocials = useMemo(() => {
		if (!profile || !profile?.socialLinks) return {};

		return JSON.parse(profile?.socialLinks);
	}, [profile]);

	const handleEditSocials = async (data: ConnectionForm) => {
		setIsSubmitting(true);
		const editUserInfo: IEditUserProps = {
			avatar: profile?.avatar || '',
			coverImage: profile?.coverImage || '',
			name: profile?.name || '',
			displayName: profile?.displayName || '',
			email: profile?.email || '',
			bio: profile?.bio || '',
			nation: profile?.nation || '',
			language: profile?.language || '',
			website: profile?.website || '',
			socialLinks: JSON.stringify(data)
		};
		try {
			await editPersonalInfo(editUserInfo);
			await loadUserInfo();
			toast.success('Updated socials successfully!', { theme: 'colored' });
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<Box>
			<Form<ConnectionForm>
				action={handleEditSocials}
				defaultValues={{
					twitter: profileSocials.twitter || '',
					youtube: profileSocials.youtube || '',
					instagram: profileSocials.instagram || '',
					facebook: profileSocials.facebook || '',
					twitch: profileSocials.twitch || '',
					tiktok: profileSocials.tiktok || '',
					steam: profileSocials.steam || '',
					discord: profileSocials.discord || ''
				}}
				schema={socialSchema}
				myRef={formRef}
			>
				<Box className="setting-box">
					<H3Title>Socials</H3Title>
					<Box display="flex" flexDirection="column" gap={1.5}>
						{socials.map(social => (
							<InputField
								key={social.id}
								name={social.id}
								startIcon={social.icon}
								disabled={isSubmitting}
								placeholder={['steam', 'discord'].includes(social.id) ? 'gamerxyz' : social.url}
							/>
						))}
					</Box>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.25 }}>
					<PrimaryButton
						onClick={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
						sx={{ width: 'auto' }}
						loading={isSubmitting}
					>
						Save changes
					</PrimaryButton>
					<SecondaryButton
						onClick={() => formRef.current?.dispatchEvent(new Event('reset', { cancelable: true, bubbles: true }))}
						sx={{ width: 'auto' }}
						disabled={isSubmitting}
					>
						Cancel
					</SecondaryButton>
				</Box>
			</Form>
		</Box>
	);
};
