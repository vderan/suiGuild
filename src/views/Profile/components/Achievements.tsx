import { useContext, useRef } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { useDevice } from 'src/hooks/useDevice';
import { useNavigate } from 'react-router';
import { CustomAvatar } from 'src/components/Avatar';
import { IconButton } from 'src/components/IconButton';
import { H2Title, H3Title, Paragraph2, Paragraph3 } from 'src/components/Typography';
import { AuthContext, IAchievement } from 'src/contexts';
import { getPlacements } from 'src/helpers/number.helpers';
import { readableDate } from 'src/helpers/date.helpers';
import { NotFound } from 'src/components/NotFound';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { useProfile } from 'src/hooks/useProfile';
import { Box, styled, Stack, Skeleton, Link } from '@mui/material';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { SecondaryButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

const StyledSwiper = styled(Swiper)(() => ({
	margin: 0
}));

export const Achievements = ({ userId }: { userId?: string }) => {
	const { profile } = useContext(AuthContext);
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));
	const { iMd, iLg } = useDevice();
	const navigate = useNavigate();
	const swiperRef = useRef<SwiperRef>(null);

	const handlePrev = () => {
		swiperRef.current?.swiper.slidePrev();
	};
	const handleNext = () => {
		swiperRef.current?.swiper.slideNext();
	};

	const achievements = user?.achievement.some || [];
	const slidesCount = iMd ? 2 : iLg ? 4 : 6;

	return (
		<Stack spacing={2.5}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={3}>
				<Stack direction="row" alignItems="center" gap={2}>
					<H2Title>Achievements</H2Title>
					{profile?.id === userId && (
						<IconButton onClick={() => navigate(`/profile/${profile?.id}/achievements`)} icon="edit" />
					)}
				</Stack>
				{achievements.length > slidesCount && (
					<Box display="flex" alignItems="center" gap={1}>
						<SecondaryButton startIcon="chevronLeft" size="small" onClick={handlePrev} />
						<SecondaryButton startIcon="chevronRight" size="small" onClick={handleNext} />
					</Box>
				)}
			</Stack>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={slidesCount} sx={{ gap: 2, flexDirection: 'row' }}>
					<Skeleton variant="rounded" height={200} width="100%" />
				</ListSkeleton>
			) : achievements.length ? (
				<StyledSwiper
					autoplay={{
						disableOnInteraction: false
					}}
					loop={achievements.length > slidesCount}
					slidesPerView={slidesCount}
					spaceBetween={16}
					ref={swiperRef}
				>
					{achievements.map((achievement, index) => (
						<SwiperSlide key={index}>
							<Achievement {...achievement} />
						</SwiperSlide>
					))}
				</StyledSwiper>
			) : (
				<NotFound description="No achievements" />
			)}
		</Stack>
	);
};

const Achievement = ({ title, year, month, place, coverImage, link }: IAchievement) => {
	return (
		<Stack
			component={Link}
			href={link}
			target="_blank"
			alignItems="center"
			gap={1}
			sx={theme => ({
				borderRadius: 1,
				padding: 1.5,
				backgroundColor: theme.palette.dark[700],
				position: 'relative',
				'&:hover': {
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
			})}
		>
			<CustomAvatar
				image={ipfsUrl(coverImage?.url ?? avatarUrl)}
				sx={{ width: theme => theme.spacing(11.25), height: theme => theme.spacing(11.25) }}
			/>
			<Stack gap={2} alignItems="center" overflow="hidden" width="100%">
				<Stack
					sx={{
						gap: 0.25,
						width: '100%'
					}}
				>
					<H3Title sx={{ width: '100%', textAlign: 'center' }} noWrap>
						{getPlacements().find(placement => placement.id === Number(place))?.label} place
					</H3Title>
					<Paragraph2 title={title} color="text.secondary" noWrap sx={{ width: '100%', textAlign: 'center' }}>
						{title}
					</Paragraph2>
				</Stack>
				<Paragraph3 sx={{ width: '100%', textAlign: 'center' }} noWrap color={theme => theme.palette.border.highlight}>
					{readableDate(new Date(Number(year), Number(month)))}
				</Paragraph3>
			</Stack>
		</Stack>
	);
};
