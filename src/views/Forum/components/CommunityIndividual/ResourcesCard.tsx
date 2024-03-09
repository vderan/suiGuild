import { Box, Link, Stack } from '@mui/material';
import { H3Title, Label, PreTitle } from 'src/components/Typography';
import { IconButton } from 'src/components/IconButton';
import { IForum } from 'src/contexts';
import { NotFound } from 'src/components/NotFound';
import { Dialog } from 'src/components/Dialog';
import { useRef, useState } from 'react';
import { useGilder } from 'src/hooks/useGilder';
import { resourceSchema } from 'src/schemas/resource.schema';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { Control, useFieldArray } from 'react-hook-form';
import { SecondaryButton } from 'src/components/Button';
import { Icon } from 'src/components/Icon';
import { ErrorHandler } from 'src/helpers';

type Resource = {
	title: string;
	url: string;
};

interface ResourcesForm {
	resources: Resource[];
}

export const ResourcesCard = ({ forum, isOwner }: { forum: IForum; isOwner: boolean }) => {
	const [isModalShown, setIsModalShown] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const resourcesFormRef = useRef<null | HTMLFormElement>(null);
	const { editCommunity } = useGilder();

	const resources = (() => {
		if (!forum?.resources) return [];

		return JSON.parse(forum.resources) as Resource[];
	})();

	const handleRules = async (data: ResourcesForm) => {
		setIsSubmitting(true);
		try {
			await editCommunity({
				idx: Number(forum.idx),
				communityData: {
					avatar: forum.avatar.some.url,
					cover: forum.coverImage.some.url,
					title: forum.title,
					description: forum.description,
					rules: forum.rules,
					links: forum.links,
					resources: JSON.stringify(data.resources)
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
					<H3Title> Resources </H3Title>
					{isOwner && <SecondaryButton startIcon="add" size="small" onClick={() => setIsModalShown(true)} />}
				</Box>
				<Box display="flex" flexDirection="column" gap={0.5}>
					{resources.length ? (
						resources.map((resource, index) => (
							<Link href={resource.url} target="_blank" key={index}>
								<Box
									sx={theme => ({
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'flex-start',
										padding: 1.5,
										gap: 1,
										background: theme.palette.dark[700],
										borderRadius: 1,
										position: 'relative',
										'&:hover': {
											'&::after': {
												content: '""',
												position: 'absolute',
												inset: 0,
												padding: theme.spacing(0.125),
												borderRadius: theme.spacing(1),
												background: theme.palette.gradient2.main,
												WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
												WebkitMaskComposite: 'xor',
												maskComposite: 'exclude'
											}
										}
									})}
								>
									<Icon icon="link2" />
									<PreTitle noWrap title={resource.title}>
										{resource.title}
									</PreTitle>
								</Box>
							</Link>
						))
					) : (
						<NotFound description="No resources" />
					)}
				</Box>
			</Stack>
			<Dialog
				title="Edit community resources"
				open={isModalShown}
				onClose={() => setIsModalShown(false)}
				onConfirmText="Save"
				onCancelText="Cancel"
				onConfirm={() =>
					resourcesFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
				}
				isConfirmLoading={isSubmitting}
				isCancelDisabled={isSubmitting}
			>
				<Form<ResourcesForm>
					action={handleRules}
					defaultValues={{
						resources: resources.length ? resources : [{ title: '', url: '' }]
					}}
					schema={resourceSchema}
					myRef={resourcesFormRef}
					render={({ control }) => <FormFields control={control} isSubmitting={isSubmitting} />}
				/>
			</Dialog>
		</>
	);
};

const FormFields = ({ control, isSubmitting }: { control: Control<ResourcesForm>; isSubmitting: boolean }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'resources'
	});

	return (
		<>
			{fields.map((field, index) => (
				<Box key={field.id} display="flex" flexDirection="column" gap={2.5}>
					<Box display="flex" justifyContent="space-between" gap={2} alignItems="center">
						<Label>Resource {index + 1}</Label>
						<IconButton icon="close" onClick={() => remove(index)} size="small" disabled={isSubmitting} />
					</Box>
					<Box display="flex" flexDirection="column" gap={1}>
						<InputField name={`resources.${index}.title`} placeholder="Title" required disabled={isSubmitting} />
						<InputField name={`resources.${index}.url`} placeholder="Url" required disabled={isSubmitting} />
					</Box>
				</Box>
			))}
			<Box>
				<SecondaryButton onClick={() => append({ title: '', url: '' })} size="small" disabled={isSubmitting}>
					Add new resource
				</SecondaryButton>
			</Box>
		</>
	);
};
