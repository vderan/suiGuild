import { Controller } from 'react-hook-form';
import { Dialog } from '../Dialog';
import { FileField } from '../FileField';
import { Form } from '../Form';
import { InputField } from '../InputField';
import { CreateCommunityForm } from '../Layout/Header/Community.types';
import { EditorField } from '../EditorField';
import { useRef, useState } from 'react';
import { useGilder } from 'src/hooks/useGilder';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { ErrorHandler } from 'src/helpers';
import { createCommunitySchema } from 'src/schemas/create-community.schema';
import { useDevice } from 'src/hooks/useDevice';

export const CreateCommunityModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const formRef = useRef<null | HTMLFormElement>(null);
	const { createCommunity } = useGilder();
	const { iMd } = useDevice();

	const handleOnFormSubmit = async (data: CreateCommunityForm) => {
		setIsSubmitting(true);

		try {
			const [profileURL, coverURL] = await Promise.all([
				uploadAttachment(data.profile, 'profile'),
				uploadAttachment(data.cover, 'cover')
			]);

			await createCommunity({
				avatar: profileURL,
				cover: coverURL,
				title: data.name,
				description: data.description,
				rules: '',
				links: '',
				resources: ''
			});
			onClose();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog
			title="Create community"
			open={isOpen}
			onClose={() => {
				onClose(), setIsSubmitting(false);
			}}
			onConfirm={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			onConfirmText="Create"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<CreateCommunityForm>
				action={handleOnFormSubmit}
				defaultValues={{
					profile: '',
					cover: '',
					name: '',
					description: ''
				}}
				myRef={formRef}
				schema={createCommunitySchema}
			>
				<FileField
					maxSize={2}
					name="profile"
					label="Profile Picture"
					btnLabel="Upload avatar"
					isDisabled={isSubmitting}
				/>
				<FileField
					maxSize={5}
					name="cover"
					label="Cover"
					btnLabel="Upload Cover"
					isFullWidth
					isDisabled={isSubmitting}
					isButtonsOnNewField={iMd}
				/>
				<InputField name="name" label="Name" placeholder="Name" maxLength={30} disabled={isSubmitting} />
				<Controller
					name="description"
					render={({ field, fieldState }) => (
						<EditorField
							placeholder="Description"
							label="Description"
							maxLength={500}
							value={field.value}
							editorHeight="150px"
							onChange={value => field.onChange(value)}
							errorMessage={fieldState.error?.message}
							isNeedImageUpload={false}
							isNeedVideoUpload={false}
							disabled={isSubmitting}
						/>
					)}
				/>
			</Form>
		</Dialog>
	);
};
