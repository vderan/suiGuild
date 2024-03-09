import { Collapse, Link, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import pluralize from 'pluralize';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { SecondaryButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { NotFound } from 'src/components/NotFound';
import { ListSkeleton } from 'src/components/Skeleton';
import { H2Title, H3Title } from 'src/components/Typography';
import { AuthContext, IVideo } from 'src/contexts';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useDevice } from 'src/hooks/useDevice';
import { useProfile } from 'src/hooks/useProfile';

export const Videos = ({ userId }: { userId?: string }) => {
	const { profile } = useContext(AuthContext);
	const navigate = useNavigate();
	const { iMd, iSm } = useDevice();
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));

	const videos = user?.videos.some || [];

	const handleCollapseChange = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const itemsCount = iSm ? 1 : iMd ? 2 : 3;

	return (
		<Stack gap={2.5}>
			<Stack direction="row" alignItems="center" gap={2}>
				<H2Title>
					{pluralize('Video', videos.length)}
					<Box component="span" sx={{ opacity: 0.3 }}>
						({videos.length})
					</Box>
				</H2Title>
				{profile?.id === userId && (
					<IconButton icon="edit" onClick={() => navigate(`/profile/${profile?.id}/videos`)} />
				)}
			</Stack>

			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={itemsCount} sx={{ gap: 2, flexDirection: 'row' }}>
					<Skeleton variant="rounded" height={240} width="100%" />
				</ListSkeleton>
			) : videos.length ? (
				<Grid container spacing={2}>
					{videos.map(
						(video, index) =>
							index < 6 && (
								<Grid key={index} item xs={12} md={6} lg={4}>
									<Video {...video} />
								</Grid>
							)
					)}
				</Grid>
			) : (
				<NotFound description="No videos" />
			)}
			{videos.length > 6 && (
				<Stack width="100%" gap={2}>
					<SecondaryButton sx={{ width: 'max-content', mx: 'auto' }} onClick={handleCollapseChange}>
						Show more
					</SecondaryButton>
					<Collapse in={isShowExpandableSection}>
						<Grid container spacing={2}>
							{videos.map(
								(video, index) =>
									index > 5 && (
										<Grid key={index} item xs={12} md={6} lg={4}>
											<Video {...video} />
										</Grid>
									)
							)}
						</Grid>
					</Collapse>
				</Stack>
			)}
		</Stack>
	);
};

const Video = ({ name, link }: IVideo) => {
	return (
		<Link
			href={link}
			target="_blank"
			sx={{
				width: '100%',
				height: 240,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				gap: 2
			}}
		>
			<Box
				sx={{
					borderRadius: 1,
					background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), url('https://i.ytimg.com/vi/pSmc4C1KXrs/maxresdefault.jpg')`,
					width: '100%',
					height: '100%',
					backgroundPosition: '50% 50%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Icon icon="play" sx={{ width: '48px', height: '48px' }} />
			</Box>
			<H3Title noWrap>{name}</H3Title>
		</Link>
	);
};
