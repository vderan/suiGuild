import { useContext, useState } from 'react';
import { H2Title } from 'src/components/Typography';
import { AuthContext, IGamingSetup } from 'src/contexts';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { SecondaryButton } from 'src/components/Button';
import { ProfileGamingSetupForm } from './ProfileGamingSetupForm';
import { useGilder } from 'src/hooks/useGilder';
import { Grid } from '@mui/material';
import { NotFound } from 'src/components/NotFound';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';

export const ProfileGamingSetup = () => {
	const { gamingSetup, loadUserInfo } = useContext(AuthContext);
	const { removeGameSetup } = useGilder();
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [item, setItem] = useState<IGamingSetup>();
	const [idx, setIdx] = useState(0);
	const { iMd } = useDevice();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setIdx(index);
		try {
			await removeGameSetup(index);
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
						<H2Title>Edit Gaming Setup</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsFormModalOpen(true)}>
							{iMd ? 'Add' : 'Add Setup'}
						</SecondaryButton>
					</>
				}
			>
				{gamingSetup.length ? (
					<Grid container spacing={2}>
						{gamingSetup.map((item, index) => (
							<Grid key={item.name + index} item xs={6} md={3} lg={2.4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && idx === index}
									isDeleteBtnDisabled={isDeleting && idx !== index}
									title={item.name}
									description={item.component}
									image={ipfsUrl(item.coverImage.url)}
									onEdit={() => {
										setItem(item);
										setIsFormModalOpen(true);
										setIdx(index);
									}}
									onDelete={() => onDeleteHandle(index)}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsFormModalOpen(true)} buttonText="Add Setup">
						<NotFound
							title="You have no setup added"
							description="Please add your first setup to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileGamingSetupForm
				idx={idx}
				isOpen={isFormModalOpen}
				item={item}
				onClose={() => {
					setIsFormModalOpen(false);
					setItem(undefined);
				}}
			/>
		</>
	);
};
