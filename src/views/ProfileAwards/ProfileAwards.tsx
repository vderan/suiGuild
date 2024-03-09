import { useContext, useState } from 'react';
import { H2Title } from 'src/components/Typography';
import { AuthContext, IAward } from 'src/contexts';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { SecondaryButton } from 'src/components/Button';
import { ProfileAwardForm } from './ProfileAwardForm';
import { useGilder } from 'src/hooks/useGilder';
import { NotFound } from 'src/components/NotFound';
import { Grid } from '@mui/material';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { readableDate } from 'src/helpers/date.helpers';

export const ProfileAwards = () => {
	const { awards, loadUserInfo } = useContext(AuthContext);
	const { removeAward } = useGilder();
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [award, setAward] = useState<IAward>();
	const [idx, setIdx] = useState(0);
	const { iMd } = useDevice();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setIdx(index);
		try {
			await removeAward(index);
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
						<H2Title>Edit Award</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsFormModalOpen(true)}>
							{iMd ? 'Add' : 'Add Award'}
						</SecondaryButton>
					</>
				}
			>
				{awards.length ? (
					<Grid container spacing={2}>
						{awards.map((award, index) => (
							<Grid key={award.title + index} item xs={6} md={3} lg={2.4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && idx === index}
									isDeleteBtnDisabled={isDeleting && idx !== index}
									title={award.title}
									description={
										award.month ? readableDate(new Date(Number(award.year), Number(award.month))) : award.year
									}
									image={ipfsUrl(award.coverImage.url)}
									onEdit={() => {
										setAward(award);
										setIsFormModalOpen(true);
										setIdx(index);
									}}
									onDelete={() => onDeleteHandle(index)}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsFormModalOpen(true)} buttonText="Add Award">
						<NotFound
							title="You have no award added"
							description="Please add your first award to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileAwardForm
				idx={idx}
				isOpen={isFormModalOpen}
				award={award}
				onClose={() => {
					setIsFormModalOpen(false);
					setAward(undefined);
				}}
			/>
		</>
	);
};
