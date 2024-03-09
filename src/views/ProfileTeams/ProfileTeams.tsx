import { useContext, useState } from 'react';
import { H2Title } from 'src/components/Typography';
import { AuthContext, ITeam } from 'src/contexts';
import { ProfileTeamForm } from './ProfileTeamForm';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { SecondaryButton } from 'src/components/Button';
import { NotFound } from 'src/components/NotFound';
import { useGilder } from 'src/hooks/useGilder';
import { Grid } from '@mui/material';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { readableDate } from 'src/helpers/date.helpers';

export const ProfileTeams = () => {
	const { teams, loadUserInfo } = useContext(AuthContext);
	const { removeTeam } = useGilder();
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [team, setTeam] = useState<ITeam>();
	const [idx, setIdx] = useState(0);
	const { iMd } = useDevice();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setIdx(index);
		try {
			await removeTeam(index);
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
						<H2Title>Edit Teams</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsFormModalOpen(true)}>
							{iMd ? 'Add' : 'Add team'}
						</SecondaryButton>
					</>
				}
			>
				{teams.length ? (
					<Grid container spacing={2}>
						{teams.map((team, index) => (
							<Grid key={team.name + index} item xs={6} md={3} lg={2.4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && idx === index}
									isDeleteBtnDisabled={isDeleting && idx !== index}
									title={team.name}
									description={`${readableDate(new Date(Number(team.startYear), Number(team.startMonth)))} - ${
										team.endYear ? readableDate(new Date(Number(team.endYear), Number(team.endMonth))) : 'Current'
									}`}
									image={ipfsUrl(team.coverImage.url)}
									onEdit={() => {
										setTeam(team);
										setIsFormModalOpen(true);
										setIdx(index);
									}}
									onDelete={() => onDeleteHandle(index)}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsFormModalOpen(true)} buttonText="Add Team">
						<NotFound
							title="You have no teams added"
							description="Please add your first team to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileTeamForm
				idx={idx}
				isOpen={isFormModalOpen}
				team={team}
				onClose={() => {
					setIsFormModalOpen(false);
					setTeam(undefined);
				}}
			/>
		</>
	);
};
