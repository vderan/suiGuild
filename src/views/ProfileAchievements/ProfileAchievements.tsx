import { Grid } from '@mui/material';
import { useContext, useState } from 'react';
import { H2Title } from 'src/components/Typography';
import { AuthContext, IAchievement } from 'src/contexts';
import { ProfileAchievementForm } from './ProfileAchievementForm';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { SecondaryButton } from 'src/components/Button';
import { useGilder } from 'src/hooks/useGilder';
import { NotFound } from 'src/components/NotFound';
import { useDevice } from 'src/hooks/useDevice';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { getPlacements } from 'src/helpers/number.helpers';
import { ErrorHandler } from 'src/helpers';

export const ProfileAchievements = () => {
	const { achievements, loadUserInfo } = useContext(AuthContext);
	const { removeAchievement } = useGilder();
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [achievement, setAchievement] = useState<IAchievement>();
	const [idx, setIdx] = useState(0);
	const { iMd } = useDevice();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setIdx(index);
		try {
			await removeAchievement(index);
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
						<H2Title>Edit Achievements</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsFormModalOpen(true)}>
							{iMd ? 'Add' : 'Add achievements'}
						</SecondaryButton>
					</>
				}
			>
				{achievements.length ? (
					<Grid container spacing={2}>
						{achievements.map((achievement, index) => (
							<Grid key={achievement.title + index} item xs={6} md={3} lg={2.4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && idx === index}
									isDeleteBtnDisabled={isDeleting && idx !== index}
									title={`${getPlacements().find(placement => placement.id == Number(achievement.place))?.label} place`}
									description={achievement.title}
									image={ipfsUrl(achievement.coverImage.url)}
									onEdit={() => {
										setAchievement(achievement);
										setIsFormModalOpen(true);
										setIdx(index);
									}}
									onDelete={() => onDeleteHandle(index)}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsFormModalOpen(true)} buttonText="Add Achievements">
						<NotFound
							title="You have no achievements added"
							description="Please add your first achievement to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileAchievementForm
				isOpen={isFormModalOpen}
				idx={idx}
				achievement={achievement}
				onClose={() => {
					setIsFormModalOpen(false);
					setAchievement(undefined);
				}}
			/>
		</>
	);
};
