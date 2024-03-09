import { useContext, useRef, useState } from 'react';
import { Checkbox } from 'src/components/Checkbox';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { Column } from 'src/components/Layout/Container';
import { FileField } from 'src/components/FileField';
import { Select } from 'src/components/Select/Select.component';
import { AuthContext, ITeam } from 'src/contexts';
import { months, years } from 'src/helpers/date.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { teamFormSchema } from 'src/schemas/team.schema';
import { ErrorHandler } from 'src/helpers';

export interface TeamForm {
	name: string;
	startYear: string;
	startMonth: string;
	endYear: string;
	endMonth: string;
	logo: string;
	isCurrentlyPlaying?: boolean;
}

export const ProfileTeamForm = ({
	idx,
	isOpen,
	onClose,
	team
}: {
	idx: number;
	isOpen: boolean;
	onClose: () => void;
	team?: ITeam;
}) => {
	const teamformRef = useRef<null | HTMLFormElement>(null);
	const { addTeam, editTeam } = useGilder();
	const { loadUserInfo } = useContext(AuthContext);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEdit = Boolean(team);

	const handleOnFormSubmit = async (data: TeamForm) => {
		setIsSubmitting(true);
		try {
			const coverImage = await uploadAttachment(data.logo, 'logo');
			const teamData = {
				name: data.name,
				startYear: data.startYear,
				startMonth: data.startMonth,
				endYear: data.endYear,
				endMonth: data.endMonth,
				logo: coverImage
			};

			if (isEdit) {
				await editTeam({ teamData, idx });
			} else {
				await addTeam(teamData);
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
			title={isEdit ? 'Edit team' : 'Add team'}
			open={isOpen}
			onClose={onClose}
			onConfirm={() =>
				// Programatically submit react hook form outside the form component
				teamformRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
			}
			onConfirmText="Save"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
		>
			<Form<TeamForm>
				action={handleOnFormSubmit}
				defaultValues={{
					name: team?.name || '',
					startYear: team?.startYear || '',
					startMonth: team?.startMonth || '',
					endYear: team?.endYear || '',
					endMonth: team?.endMonth || '',
					isCurrentlyPlaying: team && (!team?.endYear || !team?.endMonth) ? true : false,
					logo: team?.coverImage?.url ? ipfsUrl(team?.coverImage?.url) : ''
				}}
				myRef={teamformRef}
				schema={teamFormSchema}
				render={({ watch, clearErrors, setValue }) => (
					<>
						<FileField label="Team logo" name="logo" isDisabled={isSubmitting} />

						<InputField
							name="name"
							label="Name"
							maxLength={20}
							required
							placeholder="Enter name"
							disabled={isSubmitting}
						/>
						<Column>
							<Select
								name="startYear"
								fullWidth
								disabled={isSubmitting}
								label="Start year"
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
								name="startMonth"
								fullWidth
								disabled={isSubmitting}
								label="Start month"
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
						{!watch('isCurrentlyPlaying') && (
							<Column>
								<Select
									name="endYear"
									fullWidth
									label="End year"
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
									name="endMonth"
									fullWidth
									label="End month"
									options={months().map(month => {
										const value = String(month.value);
										return {
											id: value,
											value: value,
											label: month.label
										};
									})}
									disabled={isSubmitting}
									required
								/>
							</Column>
						)}

						<Checkbox
							name="isCurrentlyPlaying"
							disabled={isSubmitting}
							onChange={() => {
								setValue('endYear', '');
								setValue('endMonth', '');
								clearErrors(['endYear', 'endMonth']);
							}}
							label="I’m currently playing for this team"
						/>
					</>
				)}
			/>
		</Dialog>
	);
};
