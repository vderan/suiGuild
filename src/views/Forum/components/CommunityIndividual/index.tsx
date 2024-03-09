import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Skeleton, ButtonBase } from '@mui/material';
import { Icon } from 'src/components/Icon';
import { CommunitiesCard } from './CommunitiesCard';
import { useForums } from 'src/hooks';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { coverUrl } from 'src/constants/images.constants';
import { Stack, styled } from '@mui/system';
import { Main } from './Main';
import { ButtonSmallText } from 'src/components/Typography';
import { CommunityHeader } from './CommunityHeader';
import { useDevice } from 'src/hooks/useDevice';
import { CommunityActions } from './CommunityActions';
import { SecondaryButton } from 'src/components/Button';

export const CommunityIndividual = () => {
	const { id } = useParams();
	const { data: forums, isLoading, error: isError } = useForums();
	const individualForum = forums?.find(forum => forum.idx === id);
	const { iMid } = useDevice();
	return (
		<StyledBox>
			<Box sx={{ height: theme => theme.spacing(21.5), position: 'relative' }}>
				{isLoading ? (
					<Skeleton variant="rectangular" className="back-img" />
				) : (
					<img src={ipfsUrl(individualForum?.coverImage.some.url ?? coverUrl)} className="back-img" />
				)}
				{iMid && (
					<Stack
						direction="row"
						gap={2}
						justifyContent="space-between"
						position="absolute"
						left={0}
						top={theme => theme.spacing(3)}
						width="100%"
					>
						<BackBtn />
						{individualForum && <CommunityActions forum={individualForum} />}
					</Stack>
				)}
			</Box>

			<Box
				sx={theme => ({
					maxWidth: '1306px',
					mx: 'auto',
					display: 'grid',
					gap: theme.spacing(3.625, 2),
					gridTemplateColumns: 'auto minmax(100px,1fr) 320px',
					gridTemplateAreas: `
						'. header .'
						'communities content content'
					`,
					[theme.breakpoints.down('lg')]: {
						gridTemplateColumns: 'minmax(100px,1fr)',
						gridTemplateAreas: `
							'header'
							'content'
							'communities'
						`
					}
				})}
			>
				<Stack
					sx={{
						maxWidth: { xs: 'none', lg: '704px' },
						mx: 'auto',
						width: '100%',
						gridArea: 'header',
						position: 'relative'
					}}
				>
					{!iMid && (
						<Box sx={theme => ({ position: 'absolute', top: theme.spacing(-19) })}>
							<BackBtn />
						</Box>
					)}
					<CommunityHeader forum={individualForum} isLoading={isLoading} />
				</Stack>
				<CommunitiesCard sx={{ gridArea: 'communities' }} />
				<Main forum={individualForum} sx={{ gridArea: 'content' }} isLoading={isLoading} isError={isError} />
			</Box>
		</StyledBox>
	);
};

const BackBtn = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { iMid } = useDevice();

	const onClick = () => (location.state?.isComunityIndividualPage ? navigate('/forum#communities') : navigate(-1));

	return iMid ? (
		<SecondaryButton startIcon="chevronLeft" size="small" onClick={onClick} />
	) : (
		<ButtonBase sx={{ gap: 0.5 }} onClick={onClick}>
			<Icon
				icon="chevronLeft"
				sx={{ filter: 'drop-shadow(1px 1px 3px #000000)', color: theme => theme.palette.text.secondary }}
			/>
			<ButtonSmallText color="text.secondary" sx={{ textShadow: '0 0 3px #000000' }}>
				Go back
			</ButtonSmallText>
		</ButtonBase>
	);
};

const StyledBox = styled(Box)(({ theme }) => ({
	'& .back-img': {
		width: `calc(100% + ${theme.spacing(6)})`,
		[theme.breakpoints.down('sm')]: {
			width: `calc(100% + ${theme.spacing(4)})`,
			marginLeft: theme.spacing(-2)
		},
		height: theme.spacing(21.5),
		marginLeft: theme.spacing(-3),
		objectFit: 'cover'
	}
}));
