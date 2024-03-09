import { useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { EditCommunityForm } from 'src/components/Layout/Header/Community.types';
import { IForum } from 'src/contexts';
import { ErrorHandler } from 'src/helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { editCommunitySchema } from 'src/schemas/create-community.schema';
import { FileField } from 'src/components/FileField';

export const EditCommunityModal = ({
	isOpen,
	onClose,
	forum
}: {
	isOpen: boolean;
	onClose: () => void;
	forum: IForum;
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const editForumFormRef = useRef<null | HTMLFormElement>(null);
	const { editCommunity } = useGilder();

	const handleOnFormSubmit = async (data: EditCommunityForm) => {
		setIsSubmitting(true);
		try {
			const [profileURL, coverURL] = await Promise.all([
				uploadAttachment(data.profile, 'profile'),
				uploadAttachment(data.cover, 'cover')
			]);

			await editCommunity({
				idx: Number(forum.idx),
				communityData: {
					avatar: profileURL,
					cover: coverURL,
					title: data.name,
					description: forum.description,
					rules: forum.rules,
					links: forum.links,
					resources: forum.resources
				}
			});
			onClose?.();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog
			title="Edit community"
			open={isOpen}
			onClose={onClose}
			onConfirm={() =>
				editForumFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
			onConfirmText="Save"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<EditCommunityForm>
				action={handleOnFormSubmit}
				defaultValues={{
					profile: forum.avatar?.some?.url ? ipfsUrl(forum.avatar.some.url) : '',
					cover: forum.coverImage?.some?.url ? ipfsUrl(forum.coverImage.some.url) : '',
					name: forum.title || ''
				}}
				myRef={editForumFormRef}
				schema={editCommunitySchema}
			>
				<FileField maxSize={2} name="profile" label="Profile" btnLabel="Upload avatar" isDisabled={isSubmitting} />
				<FileField
					maxSize={5}
					name="cover"
					label="Cover"
					btnLabel="Upload Cover"
					isFullWidth
					isDisabled={isSubmitting}
				/>
				<InputField name="name" label="Name" placeholder="Name" maxLength={30} required disabled={isSubmitting} />
			</Form>
		</Dialog>
	);
};
