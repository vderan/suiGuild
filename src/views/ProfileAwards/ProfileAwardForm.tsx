import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { FileField } from 'src/components/FileField';
import { Select } from 'src/components/Select/Select.component';
import { AuthContext, IAward } from 'src/contexts';
import { Column } from 'src/components/Layout/Container';
import { months, years } from 'src/helpers/date.helpers';
import { awardFormSchema } from 'src/schemas/award.schema';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { IconButton } from 'src/components/IconButton';
import { useClipboard } from 'src/hooks/useClipboard';
import { ErrorHandler } from 'src/helpers';

export interface AwardForm {
	title: string;
	year: string;
	month: string;
	link: string;
	cover: string;
}

export const ProfileAwardForm = ({
	idx,
	isOpen,
	onClose,
	award
}: {
	idx: number;
	isOpen: boolean;
	onClose: () => void;
	award?: IAward;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const { addAward, editAward } = useGilder();
	const { loadUserInfo } = useContext(AuthContext);
	const { copy } = useClipboard();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEdit = Boolean(award);

	const handleOnFormSubmit = async (data: AwardForm) => {
		setIsSubmitting(true);
		try {
			const coverImage = await uploadAttachment(data.cover, 'cover');

			const awardData = {
				...data,
				cover: coverImage
			};

			if (isEdit) {
				await editAward({ awardData, idx });
			} else {
				await addAward(awardData);
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
			title={isEdit ? 'Edit award' : 'Add award'}
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
			<Form<AwardForm>
				action={handleOnFormSubmit}
				defaultValues={{
					title: award?.title || '',
					year: award?.year || '',
					month: award?.month || '',
					link: award?.link || '',
					cover: award?.coverImage?.url ? ipfsUrl(award?.coverImage?.url) : ''
				}}
				myRef={formRef}
				schema={awardFormSchema}
				render={({ watch }) => (
					<>
						<FileField label="Award image" name="cover" isDisabled={isSubmitting} />

						<InputField
							name="title"
							label="Name"
							maxLength={100}
							required
							placeholder="Enter name"
							disabled={isSubmitting}
						/>
						<Column>
							<Select
								name="year"
								fullWidth
								label="Year"
								options={years().map(year => {
									const _year = String(year);
									return {
										id: _year,
										value: _year,
										label: _year
									};
								})}
								required
								disabled={isSubmitting}
							/>
							<Select
								name="month"
								label="Month (optional)"
								fullWidth
								options={[
									{ id: '', value: '', label: 'Choose an option' },
									...months().map(month => {
										const value = String(month.value);
										return {
											id: value,
											value: value,
											label: month.label
										};
									})
								]}
								disabled={isSubmitting}
							/>
						</Column>
						<InputField
							name="link"
							label="Link"
							type="url"
							required
							placeholder="Enter link"
							endElement={
								<>
									<IconButton icon="copy" onClick={() => copy(watch('link'))} />
								</>
							}
							disabled={isSubmitting}
						/>
					</>
				)}
			/>
		</Dialog>
	);
};
