import Stack from '@mui/material/Stack';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { TeamAvatar } from 'src/components/Avatar';
import { IconButton } from 'src/components/IconButton';
import { NotFound } from 'src/components/NotFound';
import { H2Title, H3Title, Paragraph2 } from 'src/components/Typography';
import { AuthContext, ITeam } from 'src/contexts';
import { readableDate } from 'src/helpers/date.helpers';
import { useDevice } from 'src/hooks/useDevice';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { useProfile } from 'src/hooks/useProfile';
import { Box, Skeleton, styled } from '@mui/material';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';
import { SecondaryButton } from 'src/components/Button';

const StyledSwiper = styled(Swiper)(() => ({
	margin: 0
}));

export const Teams = ({ userId }: { userId: string | undefined }) => {
	const { profile } = useContext(AuthContext);
	const { iMd, iSm } = useDevice();
	const navigate = useNavigate();
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));
	const swiperRef = useRef<SwiperRef>(null);

	const handlePrev = () => {
		swiperRef.current?.swiper.slidePrev();
	};
	const handleNext = () => {
		swiperRef.current?.swiper.slideNext();
	};

	const teams = user?.teams.some || [];
	const slidesCount = iSm ? 1 : iMd ? 2 : 3;
	return (
		<Stack direction="column" spacing={2.5}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={3}>
				<Stack direction="row" alignItems="center" gap={2}>
					<H2Title>Teams</H2Title>
					{profile?.id === userId && (
						<IconButton icon="edit" onClick={() => navigate(`/profile/${profile?.id}/teams`)} />
					)}
				</Stack>
				{teams.length > slidesCount && (
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
					<Skeleton variant="rounded" height={174} width="100%" />
				</ListSkeleton>
			) : teams.length ? (
				<StyledSwiper
					slidesPerView={slidesCount}
					spaceBetween={16}
					autoplay={{
						disableOnInteraction: false
					}}
					loop={teams.length > slidesCount}
					ref={swiperRef}
				>
					{teams.map((team, index) => (
						<SwiperSlide key={index}>
							<Team {...team} />
						</SwiperSlide>
					))}
				</StyledSwiper>
			) : (
				<NotFound description="No teams" />
			)}
		</Stack>
	);
};

const Team = ({ startYear, startMonth, endYear, endMonth, name, coverImage }: ITeam) => {
	return (
		<Stack
			gap={3}
			sx={{
				borderRadius: 1,
				padding: 3,
				backgroundColor: theme => theme.palette.dark[700]
			}}
		>
			<TeamAvatar image={ipfsUrl(coverImage?.url ?? avatarUrl)} />
			<Stack>
				<H3Title noWrap title={name}>
					{name}
				</H3Title>
				<Paragraph2 color="text.secondary">
					{readableDate(new Date(Number(startYear), Number(startMonth)))}
					{endYear ? ` - ${readableDate(new Date(Number(endYear), Number(endMonth)))}` : ' - Current'}
				</Paragraph2>
			</Stack>
		</Stack>
	);
};
