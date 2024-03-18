import { AuthContext } from 'src/contexts';
import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { useGilder } from 'src/hooks/useGilder';
import { H4Title } from '../Typography';
import { avatarUrl, coverUrl } from 'src/constants/images.constants';
import { useProfile } from 'src/hooks/useProfile';
import { createUsernameSchema } from 'src/schemas/create-username.schema';
import { useErrorHandler, useSnackbar } from 'src/hooks';

export const UsernameDialog = () => {
	const { profile, isUsernameVisible, changeUsernameModalVisible, loadUserInfo, initChat } = useContext(AuthContext);
	const usernameFormRef = useRef<null | HTMLFormElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { editPersonalInfo } = useGilder();
	const { checkUsername } = useProfile();
	const { warningSnackbar, successSnackbar } = useSnackbar();
	const { errorProcess } = useErrorHandler();

	const handleSubmit = async (data: { username: string }) => {
		const isUserExists = await checkUsername(data.username);

		if (isUserExists) {
			warningSnackbar('Username already exists');
			return;
		}

		setIsLoading(true);

		try {
			await editPersonalInfo({
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
			});
			successSnackbar('Updated username successfully!');

			const userInfo = await loadUserInfo();
			await initChat(userInfo?.displayName);
		} catch (error) {
			errorProcess(error);
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
