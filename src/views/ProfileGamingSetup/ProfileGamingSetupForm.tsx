import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { FileField } from 'src/components/FileField';
import { Select } from 'src/components/Select/Select.component';
import { AuthContext, IGamingSetup } from 'src/contexts';
import { gamingSetupCommunities, gamingSetupComponents } from '../Profile/components/GamingSetup';
import { gamingSetupFormSchema } from 'src/schemas/gaming-setup.schema';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { ErrorHandler } from 'src/helpers';

interface GamingSetupForm {
	name: string;
	component: string;
	community: string;
	image: string;
}

export const ProfileGamingSetupForm = ({
	idx,
	isOpen,
	onClose,
	item
}: {
	idx: number;
	isOpen: boolean;
	onClose: () => void;
	item?: IGamingSetup;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const { addGameSetup, editGameSetup } = useGilder();
	const { loadUserInfo } = useContext(AuthContext);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEdit = Boolean(item);

	const handleOnFormSubmit = async (data: GamingSetupForm) => {
		setIsSubmitting(true);
		try {
			const coverImage = await uploadAttachment(data.image, 'cover');
			if (isEdit) {
				await editGameSetup(data.name, data.component, data.community, coverImage, idx);
			} else {
				await addGameSetup(data.name, data.component, data.community, coverImage);
			}
			await loadUserInfo();
			onClose();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog
			title={isEdit ? 'Edit gaming setup' : 'Add gaming setup'}
			open={isOpen}
			onClose={onClose}
			onConfirm={() =>
				// Programatically submit react hook form outside the form component
				formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
			onConfirmText="Save"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<GamingSetupForm>
				action={handleOnFormSubmit}
				defaultValues={{
					name: item?.name || '',
					component: item?.component || '',
					community: item?.community || '',
					image: item?.coverImage?.url ? ipfsUrl(item?.coverImage?.url) : ''
				}}
				myRef={formRef}
				schema={gamingSetupFormSchema}
			>
				<FileField label="Product image" name="image" isDisabled={isSubmitting} />
				<InputField
					name="name"
					label="Name"
					maxLength={100}
					required
					placeholder="Enter name"
					disabled={isSubmitting}
				/>
				<Select
					name="component"
					fullWidth
					label="Component"
					required
					options={gamingSetupComponents.map(component => ({
						id: component,
						value: component,
						label: component
					}))}
					disabled={isSubmitting}
				/>
				<Select
					name="community"
					fullWidth
					label="Community"
					required
					options={gamingSetupCommunities.map(community => ({
						id: community,
						value: community,
						label: community
					}))}
					disabled={isSubmitting}
				/>
			</Form>
		</Dialog>
	);
};
