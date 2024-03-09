import { Link, Grid, Stack, Box, styled, Skeleton } from '@mui/material';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { SecondaryButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { IconButton } from 'src/components/IconButton';
import { NotFound } from 'src/components/NotFound';
import { ListSkeleton } from 'src/components/Skeleton';
import { H2Title, H3Title, Paragraph2 } from 'src/components/Typography';
import { AuthContext, IAward } from 'src/contexts';
import { readableDate } from 'src/helpers/date.helpers';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useDevice } from 'src/hooks/useDevice';
import { useProfile } from 'src/hooks/useProfile';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

const StyledSwiper = styled(Swiper)(() => ({
	margin: 0
}));

export const Awards = ({ userId }: { userId?: string }) => {
	const { profile } = useContext(AuthContext);
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));
	const navigate = useNavigate();
	const { iMd, iSm } = useDevice();

	const swiperRef = useRef<SwiperRef>(null);

	const handlePrev = () => {
		swiperRef.current?.swiper.slidePrev();
	};
	const handleNext = () => {
		swiperRef.current?.swiper.slideNext();
	};

	const awards = user?.award.some || [];
	const slidesCount = iSm ? 1 : 2;
	return (
		<Stack gap={2.5}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={3}>
				<Stack direction="row" alignItems="center" gap={2}>
					<H2Title>My Awards</H2Title>
					{profile?.id === userId && (
						<IconButton icon="edit" onClick={() => navigate(`/profile/${profile?.id}/awards`)} />
					)}
				</Stack>
				{awards.length > slidesCount && iMd && (
					<Box display="flex" alignItems="center" gap={1}>
						<SecondaryButton startIcon="chevronLeft" size="small" onClick={handlePrev} />
						<SecondaryButton startIcon="chevronRight" size="small" onClick={handleNext} />
					</Box>
				)}
			</Stack>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={iMd ? slidesCount : 4} sx={{ gap: 2, flexDirection: 'row' }}>
					<Skeleton variant="rounded" height={288} width="100%" />
				</ListSkeleton>
			) : awards.length ? (
				iMd ? (
					<StyledSwiper
						autoplay={{
							disableOnInteraction: false
						}}
						loop={awards.length > slidesCount}
						slidesPerView={slidesCount}
						spaceBetween={16}
						ref={swiperRef}
					>
						{awards.map((award, index) => (
							<SwiperSlide key={index}>
								<Award {...award} />
							</SwiperSlide>
						))}
					</StyledSwiper>
				) : (
					<Grid container spacing={2}>
						{awards.map((award, index) => (
							<Grid key={index} item xs={12} md={6} lg={3}>
								<Award {...award} />
							</Grid>
						))}
					</Grid>
				)
			) : (
				<NotFound description="No awards" />
			)}
		</Stack>
	);
};

const Award = ({ coverImage, link, month, year, title }: IAward) => {
	return (
		<Stack component={Link} href={link} target="_blank" gap={2} className="award-card">
			<Box
				sx={theme => ({
					background: `url(${ipfsUrl(coverImage?.url)})`,
					borderRadius: 1,
					width: '100%',
					height: theme.spacing(36),
					backgroundPosition: '50% 50%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					position: 'relative',
					'.award-card:hover &': {
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
			/>
			<Stack sx={{ gap: 0.5 }}>
				<H3Title title={title} noWrap sx={{ width: '100%' }}>
					{title}
				</H3Title>
				<Paragraph2 noWrap color="text.secondary">
					{month ? readableDate(new Date(Number(year), Number(month))) : year}
				</Paragraph2>
			</Stack>
		</Stack>
	);
};
