import { useContext, useState } from 'react';
import { H2Title, H3Title } from 'src/components/Typography';
import { AuthContext, IVideo } from 'src/contexts';
import { EditCard, EditProfileLayout, EditProfileNoDataOrErrorLayout } from '../Profile/components/EditProfileLayout';
import { SecondaryButton } from 'src/components/Button';
import { ProfileVideoForm } from './ProfileVideoForm';
import { useGilder } from 'src/hooks/useGilder';
import { Grid, Stack, alpha } from '@mui/material';
import { NotFound } from 'src/components/NotFound';
import { useDevice } from 'src/hooks/useDevice';
import { ErrorHandler } from 'src/helpers';
import { Icon } from 'src/components/Icon';

const IMAGE_LINK = 'https://i.ytimg.com/vi/pSmc4C1KXrs/maxresdefault.jpg';

export const ProfileVideos = () => {
	const { videos, loadUserInfo } = useContext(AuthContext);
	const { removeVideo } = useGilder();
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [video, setVideo] = useState<IVideo>();
	const [idx, setIdx] = useState(0);
	const { iMd } = useDevice();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteHandle = async (index: number) => {
		setIsDeleting(true);
		setIdx(index);
		try {
			await removeVideo(index);
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
						<H2Title>Edit Videos</H2Title>
						<SecondaryButton startIcon="add" onClick={() => setIsFormModalOpen(true)}>
							{iMd ? 'Add' : 'Add Video'}
						</SecondaryButton>
					</>
				}
			>
				{videos.length ? (
					<Grid container spacing={2}>
						{videos.map((video, index) => (
							<Grid key={video.name + index} item xs={12} sm={6} md={4}>
								<EditCard
									isDeleteBtnLoading={isDeleting && idx === index}
									isDeleteBtnDisabled={isDeleting && idx !== index}
									title={video.name}
									image={IMAGE_LINK}
									onEdit={() => {
										setVideo(video);
										setIsFormModalOpen(true);
										setIdx(index);
									}}
									onDelete={() => onDeleteHandle(index)}
									titleElement={
										<H3Title title={video.name} noWrap>
											{video.name}
										</H3Title>
									}
									imageBoxChildren={
										<Stack
											justifyContent="center"
											alignItems="center"
											sx={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%',
												backgroundColor: theme => alpha(theme.palette.dark[900], 0.6)
											}}
										>
											<Icon icon="play" sx={{ width: theme => theme.spacing(6), height: theme => theme.spacing(6) }} />
										</Stack>
									}
								/>
							</Grid>
						))}
					</Grid>
				) : (
					<EditProfileNoDataOrErrorLayout onClick={() => setIsFormModalOpen(true)} buttonText="Add Video">
						<NotFound
							title="You have no video added"
							description="Please add your first video to showcase it in this section"
						/>
					</EditProfileNoDataOrErrorLayout>
				)}
			</EditProfileLayout>
			<ProfileVideoForm
				idx={idx}
				isOpen={isFormModalOpen}
				video={video}
				onClose={() => {
					setIsFormModalOpen(false);
					setVideo(undefined);
				}}
			/>
		</>
	);
};
