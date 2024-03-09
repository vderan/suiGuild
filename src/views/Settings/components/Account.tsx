import { Box } from '@mui/material';
import { H3Title, Paragraph3 } from 'src/components/Typography';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { useContext, useRef, useState } from 'react';
import { editAccountSchema } from 'src/schemas/setting.schema';
import { AuthContext } from 'src/contexts';
import { useGilder } from 'src/hooks/useGilder';
import { IEditUserProps } from 'src/hooks/types';
import { Dialog } from 'src/components/Dialog';
import { useProfile } from 'src/hooks/useProfile';
import { toast } from 'react-toastify';
import { ErrorHandler } from 'src/helpers';

interface EditAccountForm {
	email: string;
	username: string;
}

export const Account = () => {
	const accountFormRef = useRef<null | HTMLFormElement>(null);
	const { profile, loadUserInfo, initChat } = useContext(AuthContext);
	const { editPersonalInfo, deactivateAccount } = useGilder();
	const [open, setOpen] = useState(false);
	const [isDeactivating, setIsDeactivating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { checkUsername } = useProfile();

	const handleEditAccount = async (data: EditAccountForm) => {
		const editUserInfo: IEditUserProps = {
			avatar: profile?.avatar || '',
			coverImage: profile?.coverImage || '',
			name: profile?.name || '',
			displayName: data.username,
			email: data.email,
			bio: profile?.bio || '',
			nation: profile?.nation || '',
			language: profile?.language || '',
			website: profile?.website || '',
			socialLinks: profile?.socialLinks || ''
		};
		setIsSubmitting(true);
		try {
			if (!profile?.displayName) {
				const isUserExist = await checkUsername(data.username);
				if (isUserExist) {
					toast.warning('Username already exists', { theme: 'colored' });
					setIsSubmitting(false);
					return;
				}
			}

			await editPersonalInfo(editUserInfo);
			const userInfo = await loadUserInfo();
			await initChat(userInfo?.displayName);
			toast.success('Updated user successfully!', { theme: 'colored' });
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	const handleDeactivateAccount = async () => {
		setIsDeactivating(true);
		try {
			await deactivateAccount();
			await loadUserInfo();
			setOpen(false);
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsDeactivating(false);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(1) }}>
			<Box className="setting-box">
				<H3Title>General</H3Title>
				<Form<EditAccountForm>
					action={handleEditAccount}
					defaultValues={{
						email: profile?.email || '',
						username: profile?.displayName ?? 'gamerxyz'
					}}
					myRef={accountFormRef}
					schema={editAccountSchema}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(2) }}>
						<InputField type="text" name="email" label="Email" placeholder="gamerxyz@gmail.com" />
						<InputField
							type="text"
							name="username"
							label="Username"
							placeholder="gamerxyz"
							maxLength={30}
							disabled={profile?.displayName ? true : false}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
							<PrimaryButton
								loading={isSubmitting}
								onClick={() =>
									accountFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
								}
								sx={{ width: 'auto' }}
							>
								Update
							</PrimaryButton>
						</Box>
					</Box>
				</Form>
			</Box>
			{profile?.displayName && (
				<Box className="setting-box">
					<Box>
						<H3Title>Deactivate account</H3Title>
						<Paragraph3 color="text.secondary">Deactivating your account is a permanent action - be careful!</Paragraph3>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
						<SecondaryButton sx={{ width: 'auto' }} onClick={() => setOpen(true)}>
							Deactivate account
						</SecondaryButton>
					</Box>
				</Box>
			)}
			<Dialog
				width="dialogExtraSmall"
				open={open}
				title="Are you sure you want to deactivate your account?"
				isConfirmation
				isConfirmLoading={isDeactivating}
				isCancelDisabled={isDeactivating}
				onClose={() => setOpen(false)}
				onConfirm={handleDeactivateAccount}
				onConfirmText="Yes, deactivate"
				onCancelText="Cancel"
			/>
		</Box>
	);
};
