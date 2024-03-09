import { Stack, Grid } from '@mui/material';
import { useContext } from 'react';
import { H2Title } from 'src/components/Typography';
import { NotFound } from 'src/components/NotFound';
import { useDrafts } from 'src/hooks';
import { DraftCard } from './components/DraftCard';
import { AuthContext } from 'src/contexts';
import { GuideLine } from 'src/views/CreatePost/components/GuideLine';
import { BackButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton, DraftCardSkeleton } from 'src/components/Skeleton';

export const Drafts = () => {
	const { profile } = useContext(AuthContext);

	const { data: drafts, isLoading, error: isError } = useDrafts(profile?.id || '');
	const userDrafts = drafts || [];

	return (
		<Stack sx={{ pt: { xs: 2.5, lg: 5 }, maxWidth: '1064px', mx: 'auto' }}>
			<Grid container spacing={5}>
				<Grid item lg={8.086} xs={12}>
					<Stack gap={{ xs: 2.5, lg: 4 }}>
						<Stack flexDirection="row" alignItems="center" gap={2}>
							<BackButton />
							<H2Title>Drafts</H2Title>
						</Stack>
						<Stack gap={2}>
							{isError ? (
								<ErrorMessage description="There was an error while loading" />
							) : isLoading ? (
								<ListSkeleton numberOfItems={3} sx={{ gap: 2 }}>
									<DraftCardSkeleton />
								</ListSkeleton>
							) : userDrafts.length ? (
								userDrafts.map(draft => <DraftCard key={draft.idx} draft={draft} />)
							) : (
								<NotFound description="Please create your own draft!" />
							)}
						</Stack>
					</Stack>
				</Grid>
				<Grid item lg={3.914} xs={12}>
					<GuideLine />
				</Grid>
			</Grid>
		</Stack>
	);
};
