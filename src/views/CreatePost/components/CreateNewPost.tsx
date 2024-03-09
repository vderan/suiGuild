import { useContext, useMemo, useState } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { H2Title } from 'src/components/Typography';
import { ISelectOption, StandaloneSelect } from 'src/components/Select';
import { PrimaryEditor } from 'src/components/TextEditor';
import { CustomToggleButtonGroup, IToggleBtnOption } from 'src/components/ToggleButtonGroup';
import { useGilder } from 'src/hooks/useGilder';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { ColorModeContext } from 'src/contexts';
import { sortForumsByKeyword } from 'src/helpers/sort.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';
import { NotFound } from 'src/components/NotFound';

export const CreateNewPost = () => {
	const { getAllCommunities } = useGilder();
	const { theme } = useContext(ColorModeContext);

	const { data: forums, isLoading, error: isError } = useCustomSWR('getAllCommunities', getAllCommunities);
	const [selectValue, setSelectValue] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const quickForums: IToggleBtnOption[] = useMemo(() => {
		return sortForumsByKeyword(forums || [], 'posts')
			.slice(0, 6)
			.map(forum => ({
				id: forum.idx,
				value: forum.idx,
				label: forum.title,
				startImage: ipfsUrl(forum.avatar.some.url)
			}));
	}, [forums]);

	return (
		<Box>
			<Stack
				sx={{
					flexDirection: { sm: 'column', md: 'row' },
					width: '100%',
					justifyContent: 'space-between',
					alignItems: { sm: 'flex-start', md: 'center' },
					mb: 4,
					gap: 2
				}}
			>
				<H2Title>Create Post</H2Title>

				<StandaloneSelect
					name="select"
					boxSx={{
						width: theme.spacing(30),
						[theme.breakpoints.down('md')]: {
							width: '100%'
						}
					}}
					disabled={isSubmitting}
					value={selectValue}
					sxMenuItem={{ width: { sm: '100%', md: '250px' } }}
					options={selectOption}
					onChange={option => setSelectValue(option)}
				/>
			</Stack>
			<Box mb={3}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : isLoading ? (
					<ListSkeleton numberOfItems={6} sx={{ gap: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
						<Skeleton variant="rounded" height={30} width={100} />
					</ListSkeleton>
				) : quickForums.length ? (
					<CustomToggleButtonGroup
						sx={{
							'& .MuiToggleButtonGroup-grouped': {
								backgroundColor: theme => theme.palette.dark[500],
								fontSize: theme => theme.spacing(1.5),
								padding: 0.875,
								'&:not(:first-of-type)': {
									border: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
								},
								'&:first-of-type': {
									border: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
								},
								'&:hover': {
									backgroundColor: 'transparent'
								},
								'&.Mui-selected': {
									border: 'none'
								}
							}
						}}
						key={selectValue}
						defaultValue={selectValue}
						options={quickForums}
						isDisabled={isSubmitting}
						onChange={value => setSelectValue(value)}
					/>
				) : (
					<NotFound description="Communities not found!" />
				)}
			</Box>
			<PrimaryEditor
				communityIndex={selectValue ? Number(selectValue) : undefined}
				onSubmitStart={() => setIsSubmitting(true)}
				onSubmitEnd={() => setIsSubmitting(false)}
			/>
		</Box>
	);
};
