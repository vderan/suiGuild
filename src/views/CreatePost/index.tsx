import { Box, Grid, Stack } from '@mui/material';
import { CreateNewPost } from './components/CreateNewPost';
import { GuideLine } from './components/GuideLine';
import { H3Title } from 'src/components/Typography';
import { SecondaryButton } from 'src/components/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'src/contexts';
import { useContext, useMemo } from 'react';
import { useDrafts } from 'src/hooks';

export const CreatePost = () => {
	const navigate = useNavigate();
	const { profile } = useContext(AuthContext);
	const { data: drafts } = useDrafts(profile?.id || '');

	const draftCounts = useMemo(() => {
		if (!drafts || !profile?.id) return 0;

		return drafts.length;
	}, [drafts, profile?.id]);

	return (
		<Box sx={{ pt: { xs: 2.5, lg: 5 }, maxWidth: '1064px', mx: 'auto' }}>
			<Grid container spacing={5}>
				<Grid item lg={8.086} xs={12}>
					<CreateNewPost />
				</Grid>
				<Grid item lg={3.914} xs={12}>
					<Stack gap={2}>
						<Stack sx={{ padding: 2, backgroundColor: theme => theme.palette.dark[500], borderRadius: 1.5, gap: 2 }}>
							<H3Title>
								Drafts{' '}
								<Box color="text.secondary" component="span">
									({draftCounts})
								</Box>
							</H3Title>
							<SecondaryButton fullWidth onClick={() => navigate('/drafts')}>
								View all
							</SecondaryButton>
						</Stack>

						<GuideLine />
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};
