import { Box } from '@mui/material';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog } from 'src/components/Dialog';
import { FileField } from 'src/components/FileField';
import { Form } from 'src/components/Form';
import { ImageField } from 'src/components/ImageField';
import { InputField } from 'src/components/InputField';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { newGroupSchema } from 'src/schemas/new-group.schema';

interface GroupFormData {
	name: string;
	description: string;
	avatar: string;
}

export const GroupForm = ({
	open,
	defaultValues,
	onClose,
	onSubmit
}: {
	open: boolean;
	defaultValues?: GroupFormData;
	onClose: () => void;
	onSubmit: (data: GroupFormData) => Promise<void> | void;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleOnFormSubmit = async (data: GroupFormData) => {
		setIsSubmitting(true);

		try {
			await onSubmit(data);
			onClose();
		} catch (error) {
			toast.error((error as Error).message, { theme: 'colored' });
		}
		setIsSubmitting(false);
	};

	const isEdit = !!defaultValues;

	return (
		<Dialog
			width="dialogSmall"
			title={isEdit ? 'Edit Group' : 'Create Group'}
			open={open}
			onClose={onClose}
			onConfirm={() =>
				// Programatically submit react hook form outside the form component
				formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
			onConfirmText={isEdit ? 'Save' : 'Create'}
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<GroupFormData>
				action={handleOnFormSubmit}
				defaultValues={{
					name: defaultValues?.name || '',
					description: defaultValues?.description || '',
					avatar: defaultValues?.avatar ? ipfsUrl(defaultValues?.avatar) : ''
				}}
				myRef={formRef}
				schema={newGroupSchema}
			>
				<Box display="flex" gap={{ xs: 2, sm: 4 }} alignItems="flex-start">
					<FileField
						isButtonsOnNewField
						isUploadInfoInRow
						maxSize={2}
						isDisabled={isSubmitting}
						name="avatar"
						label="Avatar"
						btnLabel="Upload"
					/>
					<Box sx={{ marginTop: 3.625 }}>
						<ImageField disabled={isSubmitting} name="avatar" />
					</Box>
				</Box>
				<InputField
					name="name"
					label="Group name"
					required
					placeholder="Enter group name"
					maxLength={100}
					disabled={isSubmitting}
				/>
				<InputField
					name="description"
					label="Description"
					placeholder="Enter group description"
					maxLength={500}
					multiline
					disabled={isSubmitting}
				/>
			</Form>
		</Dialog>
	);
};
