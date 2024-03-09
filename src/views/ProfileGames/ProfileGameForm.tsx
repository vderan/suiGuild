import { Box, FormHelperText, Stack, Skeleton, ButtonBase, Grid } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { api } from 'src/api';
import { Dialog } from 'src/components/Dialog';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { NotFound } from 'src/components/NotFound';
import { ListSkeleton } from 'src/components/Skeleton';
import { H4Title } from 'src/components/Typography';
import { AuthContext } from 'src/contexts';
import { ErrorHandler } from 'src/helpers';
import { useDebounce } from 'src/hooks/useDebounce';
import { useDevice } from 'src/hooks/useDevice';
import { useGilder } from 'src/hooks/useGilder';
import { addGameSchema } from 'src/schemas/add-game.schema';
import useSWR from 'swr';

interface ProfileGameForm {
	selectedGames: number[];
	search: string;
}

export const ProfileGamesForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const formRef = useRef<null | HTMLFormElement>(null);
	const [searchValue, setSearchValue] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const debouncedSearchValue = useDebounce(searchValue, 500);
	const { addGameSummary } = useGilder();
	const { iMid } = useDevice();

	const {
		data: games,
		isLoading,
		error: isError
	} = useSWR('games' + debouncedSearchValue, () => api.games.searchGames(debouncedSearchValue));
	const { loadUserInfo } = useContext(AuthContext);

	useEffect(() => {
		setSearchValue('');
	}, [isOpen]);

	const handleOnFormSubmit = async (data: ProfileGameForm) => {
		setIsSubmitting(true);
		try {
			await addGameSummary(data.selectedGames.map(String));
			await loadUserInfo();
			onClose();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog
			title="Select Game"
			open={isOpen}
			onClose={onClose}
			onConfirm={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			onConfirmText="Add Game"
			onCancelText="Cancel"
			isConfirmLoading={isSubmitting}
			isCancelDisabled={isSubmitting}
			sx={{
				'& .MuiDialogContent-root': {
					display: 'flex',
					flexDirection: 'column'
				}
			}}
		>
			<Form<ProfileGameForm>
				action={handleOnFormSubmit}
				defaultValues={{
					search: '',
					selectedGames: []
				}}
				myRef={formRef}
				schema={addGameSchema}
				formStyles={{
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden'
				}}
				formGroupProps={{ sx: { overflow: 'hidden', flexWrap: 'nowrap' } }}
			>
				<InputField
					startIcon="search"
					name="search"
					onChange={value => setSearchValue(value)}
					placeholder="Search"
					disabled={isSubmitting}
				/>
				<Controller
					name="selectedGames"
					render={({ field, fieldState }) => (
						<>
							<Stack gap={2} width="100%" overflow="auto">
								{isError ? (
									<ErrorMessage
										iconProps={{
											sx: {
												color: theme => theme.palette.dark[900]
											}
										}}
										description="There was an error while loading"
									/>
								) : isLoading ? (
									<ListSkeleton numberOfItems={iMid ? 2 : 4} sx={{ gap: 2, flexDirection: 'row' }}>
										<Skeleton variant="rounded" height={210} width="100%" />
									</ListSkeleton>
								) : games?.results.length ? (
									<Grid container spacing={2}>
										{games.results.map(game => (
											<Grid key={game.id} item xs={6} lg={3}>
												<Stack
													component={ButtonBase}
													key={game.id}
													gap={1}
													overflow="hidden"
													width="100%"
													disabled={isSubmitting}
													onClick={() => {
														const value = field.value;
														if (field.value.includes(game.id)) {
															field.onChange(value.filter((id: number) => id !== game.id));
														} else {
															field.onChange([...value, game.id]);
														}
													}}
												>
													<Box
														sx={theme => ({
															background: `url(${game.background_image})`,
															borderRadius: 1,
															width: '100%',
															height: theme.spacing(26.25),
															backgroundPosition: '50% 50%',
															backgroundRepeat: 'no-repeat',
															backgroundSize: 'cover',
															position: 'relative',
															...(field.value.includes(game.id)
																? {
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
																: {})
														})}
													/>
													<H4Title width="100%" textAlign="left" noWrap>
														{game.name}
													</H4Title>
												</Stack>
											</Grid>
										))}
									</Grid>
								) : (
									<NotFound
										iconProps={{
											sx: {
												color: theme => theme.palette.dark[900]
											}
										}}
										description="No games"
									/>
								)}
							</Stack>
							{fieldState.error?.message && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
						</>
					)}
				/>
			</Form>
		</Dialog>
	);
};
