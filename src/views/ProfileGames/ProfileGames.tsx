import { useContext, useState } from 'react';
import { SecondaryButton } from 'src/components/Button';
import { H2Title } from 'src/components/Typography';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { AuthContext } from 'src/contexts';
import { ProfileGamesForm } from './ProfileGameForm';
import { Grid, Skeleton } from '@mui/material';
import { NotFound } from 'src/components/NotFound';
import { getGameDetails } from 'src/api/games';
import { useGilder } from 'src/hooks/useGilder';
import { useDevice } from 'src/hooks/useDevice';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { ErrorHandler } from 'src/helpers';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

export const ProfileGames = () => {
	const { gameSummaries, loadUserInfo } = useContext(AuthContext);
	const [isAddGamesModalOpen, setIsAddGamesModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { removeGameSummary } = useGilder();
	const { iMd, iMid } = useDevice();

	const {
		data: games,
		isLoading,
		error: isError
	} = useCustomSWR('getUserProfileGames', async () => {
		return await Promise.all(
			gameSummaries.map(async gamesum => {
				const game = await getGameDetails(gamesum);
				return {
					id: game.id,
					name: game.name,
					backgroundImage: game.background_image
				};
			})
		);
	});

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setSelectedIndex(index);
		try {
			await removeGameSummary(index);
			await loadUserInfo();
		} catch (e) {
			ErrorHandler.process(e);
		}
		setIsDeleting(false);
	};

	return (
		<>
			<EditProfileLayout
				header={
					<>
						<H2Title>Edit Games</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsAddGamesModalOpen(true)}>
							{iMd ? 'Add' : 'Add Game'}
						</SecondaryButton>
					</>
				}
			>
				{isError ? (
					<EditProfileNoDataOrErrorLayout>
						<ErrorMessage
							title="We couldn't load your data"
							description="Please reload the page or contact the support if the problem persist."
						/>
					</EditProfileNoDataOrErrorLayout>
				) : isLoading ? (
					<ListSkeleton numberOfItems={iMd ? 2 : iMid ? 4 : 5} sx={{ gap: 2, flexDirection: 'row' }}>
						<Skeleton variant="rounded" height={iMid ? 250 : 300} width="100%" />
					</ListSkeleton>
				) : games && games.length ? (
					<Grid container spacing={2}>
						{games.map((gameSummary, index) => (
							<Grid key={gameSummary.id + index} item xs={6} md={3} lg={2.4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && selectedIndex === index}
									isDeleteBtnDisabled={isDeleting && selectedIndex !== index}
									title={gameSummary.name}
									image={gameSummary.backgroundImage}
									onDelete={() => onDeleteHandle(index)}
									imageSx={{
										height: theme => ({ xs: theme.spacing(31.25), lg: theme.spacing(37.5) })
									}}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsAddGamesModalOpen(true)} buttonText="Add Game">
						<NotFound
							title="You have no games added"
							description="Please add your first game to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileGamesForm isOpen={isAddGamesModalOpen} onClose={() => setIsAddGamesModalOpen(false)} />
		</>
	);
};
