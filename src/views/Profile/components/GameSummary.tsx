import { Stack, Box, styled, Skeleton } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { IconButton } from 'src/components/IconButton';
import { H2Title, H3Title } from 'src/components/Typography';
import { AuthContext } from 'src/contexts';
import { useDevice } from 'src/hooks/useDevice';
import { getGameDetails } from 'src/api/games';
import { NotFound } from 'src/components/NotFound';
import { useProfile } from 'src/hooks/useProfile';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { SecondaryButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

const StyledSwiper = styled(Swiper)(() => ({
	margin: 0
}));

export const GameSummary = ({ userId }: { userId: string | undefined }) => {
	const { profile } = useContext(AuthContext);
	const navigate = useNavigate();
	const { iSm } = useDevice();
	const { getUserInfo } = useProfile();

	const {
		data: games,
		isLoading,
		error: isError
	} = useCustomSWR('getUserGames' + userId, async () => {
		const user = await getUserInfo(userId);
		if (!user?.gameSummary?.some) return [];
		return await Promise.all(
			user.gameSummary.some.map(async gamesum => {
				const game = await getGameDetails(gamesum);
				return {
					id: game.id,
					name: game.name,
					backgroundImage: game.background_image
				};
			})
		);
	});
	const swiperRef = useRef<SwiperRef>(null);

	const handlePrev = () => {
		swiperRef.current?.swiper.slidePrev();
	};
	const handleNext = () => {
		swiperRef.current?.swiper.slideNext();
	};

	const slidesCount = iSm ? 1 : 2;
	return (
		<Stack spacing={2.5}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={3}>
				<Box display="flex" alignItems="center" gap={2}>
					<H2Title>Games</H2Title>
					{profile?.id === userId && (
						<IconButton icon="edit" onClick={() => navigate(`/profile/${profile?.id}/games`)} />
					)}
				</Box>
				{games && games.length > slidesCount && (
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
					<Skeleton variant="rounded" height={180} width="100%" />
				</ListSkeleton>
			) : games?.length ? (
				<StyledSwiper
					slidesPerView={slidesCount}
					spaceBetween={16}
					autoplay={{
						disableOnInteraction: false
					}}
					loop={games.length > slidesCount}
					ref={swiperRef}
				>
					{games.map(gameSummary => (
						<SwiperSlide key={gameSummary.id}>
							<Game {...gameSummary} />
						</SwiperSlide>
					))}
				</StyledSwiper>
			) : (
				<NotFound description="No games" />
			)}
		</Stack>
	);
};

const Game = ({ backgroundImage, name }: { backgroundImage: string; name: string }) => {
	return (
		<Box
			sx={{
				backgroundImage: `url(${backgroundImage})`,
				borderRadius: 1,
				minHeight: 180,
				backgroundPosition: '50% 50%',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundColor: theme => theme.palette.dark[700],
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
				objectFit: 'fill',
				px: 2
			}}
		>
			<H3Title noWrap title={name} sx={{ textShadow: '0 0 3px #000000' }}>
				{name}
			</H3Title>
		</Box>
	);
};
