import { Box, Stack } from '@mui/material';
import { H3Title, Label } from 'src/components/Typography';
import { IForum } from 'src/contexts';
import { IconButton } from 'src/components/IconButton';
import { Dialog } from 'src/components/Dialog';
import { useRef, useState } from 'react';
import { Form } from 'src/components/Form';
import { useGilder } from 'src/hooks/useGilder';
import { ruleSchema } from 'src/schemas/rule.schema';
import { InputField } from 'src/components/InputField';
import { Control, useFieldArray } from 'react-hook-form';
import { SecondaryButton } from 'src/components/Button';
import { NotFound } from 'src/components/NotFound';
import { RuleCollapseCard } from './RuleCollapseCard';
import { ErrorHandler } from 'src/helpers';

type Rule = {
	title: string;
	content: string;
};

interface RuleForm {
	rules: Rule[];
}

export const RulesCard = ({ forum, isOwner }: { forum: IForum; isOwner: boolean }) => {
	const [isModalShown, setIsModalShown] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const ruleFormRef = useRef<null | HTMLFormElement>(null);
	const { editCommunity } = useGilder();

	const rules = (() => {
		if (!forum?.rules) return [];

		return JSON.parse(forum.rules) as Rule[];
	})();

	const handleRules = async (data: RuleForm) => {
		setIsSubmitting(true);

		try {
			await editCommunity({
				idx: Number(forum.idx),
				communityData: {
					avatar: forum.avatar.some.url,
					cover: forum.coverImage.some.url,
					title: forum.title,
					description: forum.description,
					rules: JSON.stringify(data.rules),
					links: forum.links,
					resources: forum.resources
				}
			});
			setIsModalShown(false);
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<>
			<Stack gap={2}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<H3Title> Rules </H3Title>
					{isOwner && <SecondaryButton startIcon="add" size="small" onClick={() => setIsModalShown(true)} />}
				</Box>
				<Stack gap={0.5}>
					{rules.length ? (
						rules.map((rule, index) => <RuleCollapseCard key={index} title={rule.title} content={rule.content} />)
					) : (
						<NotFound description="No rules" />
					)}
				</Stack>
			</Stack>

			<Dialog
				title="Edit community rules"
				open={isModalShown}
				onClose={() => setIsModalShown(false)}
				onConfirmText="Save"
				onCancelText="Cancel"
				onConfirm={() => ruleFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
				isConfirmLoading={isSubmitting}
				isCancelDisabled={isSubmitting}
			>
				<Form<RuleForm>
					action={handleRules}
					defaultValues={{
						rules: rules.length ? rules : [{ title: '', content: '' }]
					}}
					schema={ruleSchema}
					myRef={ruleFormRef}
					render={({ control }) => <FormFields control={control} isSubmitting={isSubmitting} />}
				/>
			</Dialog>
		</>
	);
};

const FormFields = ({ control, isSubmitting }: { control: Control<RuleForm>; isSubmitting: boolean }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'rules'
	});

	return (
		<>
			{fields.map((field, index) => (
				<Box key={field.id} display="flex" flexDirection="column" gap={2.5}>
					<Box display="flex" justifyContent="space-between" gap={2} alignItems="center">
						<Label>Rule {index + 1}</Label>
						<IconButton icon="close" onClick={() => remove(index)} size="small" disabled={isSubmitting} />
					</Box>
					<Box display="flex" flexDirection="column" gap={1}>
						<InputField
							name={`rules.${index}.title`}
							placeholder="Title"
							maxLength={100}
							required
							disabled={isSubmitting}
						/>
						<InputField
							name={`rules.${index}.content`}
							placeholder="Description"
							multiline
							maxLength={200}
							required
							disabled={isSubmitting}
						/>
					</Box>
				</Box>
			))}
			<Box>
				<SecondaryButton onClick={() => append({ title: '', content: '' })} size="small" disabled={isSubmitting}>
					Add new rule
				</SecondaryButton>
			</Box>
		</>
	);
};
