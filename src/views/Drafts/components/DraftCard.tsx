import { useState } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { PrimaryButton } from 'src/components/Button';
import { H4Title, Paragraph2, Paragraph3 } from 'src/components/Typography';
import { IPost } from 'src/contexts';
import { PrimaryEditor } from 'src/components/TextEditor';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { Dialog } from 'src/components/Dialog';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { ISelectOption, StandaloneSelect } from 'src/components/Select';
import { differenceDate } from 'src/helpers/date.helpers';

export const DraftCard = ({ draft }: { draft: IPost }) => {
	const { getAllCommunities } = useGilder();
	const { data: forums, isLoading } = useCustomSWR('getAllCommunities', getAllCommunities);
	const [isEditModalOpened, setIsEditModalOpened] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [communityIndex, setCommunityIndex] = useState<string>(draft.communityIdx);

	// TODO: refactor
	const selectOption: ISelectOption[] =
		forums?.map(forum => ({
			id: forum.idx,
			idx: Number(forum.idx),
			avatar: ipfsUrl(forum.avatar.some.url),
			coverImage: ipfsUrl(forum.coverImage.some.url),
			createdAt: Number(forum.createdAt),
			creatorInfo: forum.creatorInfo,
			description: forum.description,
			followers: forum.followers,
			members: forum.members,
			numPost: Number(forum.numPost),
			label: forum.title,
			value: forum.idx,
			visible: forum.visible
		})) || [];

	const forum = forums?.find(forum => forum.idx === draft.communityIdx);

	return (
		<Stack
			sx={theme => ({
				gap: 3,
				padding: 3,
				background: theme.palette.dark[700],
				borderRadius: 1
			})}
		>
			<Stack
				sx={{
					flexDirection: 'row',
					gap: 1,
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				{isLoading ? (
					<Skeleton variant="text" height={20} width={150} />
				) : (
					<Paragraph2 color="text.secondary" noWrap>
						{forum?.title}
					</Paragraph2>
				)}

				<Paragraph3 color="text.secondary" whiteSpace="nowrap">
					{differenceDate(Number(draft.createdAt))}
				</Paragraph3>
			</Stack>
			<Box>
				<H4Title noWrap title={draft.title}>
					{draft.title}
				</H4Title>
				<PrimaryEditor readOnly readContent={draft.message} post={draft} />
			</Box>
			<PrimaryButton sx={{ width: 'max-content' }} size="small" onClick={() => setIsEditModalOpened(true)}>
				Edit
			</PrimaryButton>

			<Dialog
				title="Edit draft"
				nofooter
				open={isEditModalOpened}
				onClose={() => {
					setIsEditModalOpened(false), setCommunityIndex(draft.communityIdx);
					setIsSubmitting(false);
				}}
			>
				<StandaloneSelect
					name="select"
					boxSx={{ mb: 1 }}
					fullWidth
					disabled={isSubmitting}
					value={communityIndex}
					options={selectOption}
					onChange={index => setCommunityIndex(index)}
				/>
				<PrimaryEditor
					title={draft.title}
					content={draft.message}
					post={draft}
					communityIndex={Number(communityIndex)}
					onClose={() => setIsEditModalOpened(false)}
					onSubmitStart={() => setIsSubmitting(true)}
					onSubmitEnd={() => setIsSubmitting(false)}
				/>
			</Dialog>
		</Stack>
	);
};
