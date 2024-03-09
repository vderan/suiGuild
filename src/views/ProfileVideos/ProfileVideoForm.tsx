import { Box } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { InputField } from 'src/components/InputField';
import { Paragraph2 } from 'src/components/Typography';
import { AuthContext, IVideo } from 'src/contexts';
import { ErrorHandler } from 'src/helpers';
import { useClipboard } from 'src/hooks/useClipboard';
import { useGilder } from 'src/hooks/useGilder';
import { videoFormSchema } from 'src/schemas/video.schema';

export interface VideoForm {
	name: string;
	link: string;
}

export const ProfileVideoForm = ({
	idx,
	isOpen,
	onClose,
	video
}: {
	idx: number;
	isOpen: boolean;
	onClose: () => void;
	video?: IVideo;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const { addVideo, editVideo } = useGilder();
	const { loadUserInfo } = useContext(AuthContext);
	const { copy } = useClipboard();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEdit = Boolean(video);

	const handleOnFormSubmit = async (data: VideoForm) => {
		setIsSubmitting(true);
		try {
			if (isEdit) {
				await editVideo(data.name, data.link, idx);
			} else {
				await addVideo(data.name, data.link);
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
			title={isEdit ? 'Edit video' : 'Add video'}
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
			<Form<VideoForm>
				action={handleOnFormSubmit}
				defaultValues={{
					name: video?.name || '',
					link: video?.link || ''
				}}
				myRef={formRef}
				schema={videoFormSchema}
				render={({ watch }) => (
					<>
						<InputField
							name="name"
							label="Name"
							maxLength={100}
							required
							placeholder="Enter name"
							disabled={isSubmitting}
						/>
						<InputField
							name="link"
							label="Media URL"
							type="link"
							required
							placeholder="Enter URL"
							endElement={
								<>
									<IconButton icon="copy" onClick={() => copy(watch('link'))} />
								</>
							}
							disabled={isSubmitting}
						/>
						<Box
							sx={{
								alignItems: 'center',
								display: 'flex',
								gap: 1
							}}
						>
							<Paragraph2 color="text.secondary">Supported media</Paragraph2>
							<Icon icon="twitch" />
							<Icon icon="instagram" />
							<Icon icon="tiktok" />
							<Icon icon="youtube" />
						</Box>
					</>
				)}
			/>
		</Dialog>
	);
};
