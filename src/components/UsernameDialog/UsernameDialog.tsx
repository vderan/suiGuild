import { AuthContext } from 'src/contexts';
import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { useGilder } from 'src/hooks/useGilder';
import { toast } from 'react-toastify';
import { H4Title } from '../Typography';
import { avatarUrl, coverUrl } from 'src/constants/images.constants';
import { useProfile } from 'src/hooks/useProfile';
import { IEditUserProps } from 'src/hooks/types';
import { createUsernameSchema } from 'src/schemas/create-username.schema';

export const UsernameDialog = () => {
	const { profile, isUsernameVisible, changeUsernameModalVisible, loadUserInfo, initChat } = useContext(AuthContext);
	const usernameFormRef = useRef<null | HTMLFormElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { editPersonalInfo } = useGilder();
	const { checkUsername } = useProfile();

	const handleSubmit = async (data: { username: string }) => {
		const isUser = await checkUsername(data.username);

		if (isUser) {
			toast.warning('Username already exists', { theme: 'colored' });
			return;
		}

		setIsLoading(true);

		const editUserInfo: IEditUserProps = {
			avatar: profile?.avatar || avatarUrl,
			coverImage: profile?.coverImage || coverUrl,
			name: profile?.name || '',
			displayName: data.username,
			email: profile?.email || '',
			bio: profile?.bio || '',
			nation: profile?.nation || '',
			language: profile?.language || '',
			website: profile?.website || '',
			socialLinks: profile?.socialLinks || ''
		};

		try {
			await editPersonalInfo(editUserInfo);
			const userInfo = await loadUserInfo();
			await initChat(userInfo?.displayName);
			toast.success('Updated username successfully!', { theme: 'colored' });
		} catch (error) {
			toast.error((error as Error).message, { theme: 'colored' });
		}
		setIsLoading(false);
	};

	return (
		<Dialog
			width="dialogMedium"
			title="Welcome!"
			open={isUsernameVisible}
			onClose={changeUsernameModalVisible}
			onConfirm={() => usernameFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			onConfirmText="Continue"
			onCancelText="I'll do this later"
			isConfirmLoading={isLoading}
			isCancelDisabled={isLoading}
		>
			<Form
				action={handleSubmit}
				defaultValues={{
					username: ''
				}}
				myRef={usernameFormRef}
				schema={createUsernameSchema}
			>
				<H4Title>Start by entering username: </H4Title>
				<InputField name="username" placeholder="gamyerxyz" maxLength={30} disabled={isLoading} />
			</Form>
		</Dialog>
	);
};
