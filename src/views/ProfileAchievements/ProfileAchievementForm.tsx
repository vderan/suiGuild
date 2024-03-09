import { useContext, useRef, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { Column } from 'src/components/Layout/Container';
import { FileField } from 'src/components/FileField';
import { Select } from 'src/components/Select/Select.component';
import { AuthContext, IAchievement } from 'src/contexts';
import { months, years } from 'src/helpers/date.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getPlacements } from 'src/helpers/number.helpers';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { achievementFormSchema } from 'src/schemas/achievemet.schema';
import { ErrorHandler } from 'src/helpers';

export interface AchievementForm {
	title: string;
	description: string;
	year: string;
	month: string;
	place: string;
	team: string;
	link: string;
	cover: string;
}

export const ProfileAchievementForm = ({
	idx,
	isOpen,
	onClose,
	achievement
}: {
	idx: number;
	isOpen: boolean;
	onClose: () => void;
	achievement?: IAchievement;
}) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const { addAchievement, editAchievement } = useGilder();
	const { loadUserInfo } = useContext(AuthContext);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEdit = Boolean(achievement);

	const handleOnFormSubmit = async (data: AchievementForm) => {
		setIsSubmitting(true);
		try {
			const cover = await uploadAttachment(data.cover, 'cover');
			const achievementData = {
				...data,
				description: '',
				team: '',
				cover
			};
			if (isEdit) {
				await editAchievement({ achievementData, idx });
			} else {
				await addAchievement(achievementData);
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
			title={isEdit ? 'Edit achievement' : 'Add achievement'}
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
			<Form<AchievementForm>
				action={handleOnFormSubmit}
				defaultValues={{
					title: achievement?.title || '',
					year: achievement?.year || '',
					month: achievement?.month || '',
					place: achievement?.place || '',
					cover: achievement?.coverImage?.url ? ipfsUrl(achievement.coverImage.url) : '',
					link: achievement?.link || ''
				}}
				myRef={formRef}
				schema={achievementFormSchema}
				render={() => (
					<>
						<FileField maxSize={2} label="Achievement image" name="cover" isDisabled={isSubmitting} />

						<InputField
							name="title"
							label="Name"
							maxLength={20}
							required
							placeholder="Enter name"
							disabled={isSubmitting}
						/>
						<Column>
							<Select
								name="year"
								fullWidth
								disabled={isSubmitting}
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
							/>
							<Select
								name="month"
								fullWidth
								disabled={isSubmitting}
								label="Month"
								options={months().map(month => {
									const value = String(month.value);
									return {
										id: value,
										value: value,
										label: month.label
									};
								})}
								required
							/>
						</Column>
						<Column>
							<Select
								name="place"
								fullWidth
								disabled={isSubmitting}
								label="Placement"
								options={getPlacements().map(placement => {
									const value = String(placement.id);
									return {
										id: value,
										value: value,
										label: placement.label
									};
								})}
								required
							/>
							<InputField
								name="link"
								label="Link"
								required
								placeholder="Link to your achievement"
								disabled={isSubmitting}
							/>
						</Column>
					</>
				)}
			/>
		</Dialog>
	);
};
