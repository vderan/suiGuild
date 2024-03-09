import { Box } from '@mui/material';
import { TrendingPosts } from '../TrendingPosts';
import { PostIndividualMain } from './PostIndividualMain';

export const PostIndividual = () => {
	return (
		<Box sx={{ pt: { xs: 2.5, lg: 5 }, maxWidth: { xs: '1356px', desktop: '1084px' }, mx: 'auto' }}>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: 'minmax(100px, 1fr)', lg: 'minmax(100px, 1fr) minmax(100px, 320px)' }
				}}
				gap={{ xs: 5, lg: 7.375 }}
			>
				<Box
					sx={{
						width: '100%',
						maxWidth: { xs: 'none', lg: '704px' },
						mx: 'auto'
					}}
				>
					<PostIndividualMain />
				</Box>
				<Box
					sx={theme => ({
						gap: 2.5,
						display: 'flex',
						flexDirection: 'column',
						[theme.breakpoints.down('lg')]: {
							padding: 3,
							background: theme.palette.dark[500],
							borderRadius: 1.5,
							border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
						}
					})}
				>
					<TrendingPosts />
				</Box>
			</Box>
		</Box>
	);
};
