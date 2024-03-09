import { Box } from '@mui/system';
import { H3Title, H4Title, Paragraph2, Label } from 'src/components/Typography';
import { guidelines } from 'src/constants/guidelines.constants';

export const GuideLine = () => {
	return (
		<Box sx={{ padding: 2, backgroundColor: theme => theme.palette.dark[500], borderRadius: 1.5 }}>
			<H3Title>Guidelines</H3Title>
			{guidelines.map(guideline => (
				<Box
					sx={{
						py: 2,
						gap: 1.5,
						display: 'flex',
						flexDirection: 'column',
						borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
					}}
					key={guideline.id}
				>
					<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
						<Box
							sx={theme => ({
								minWidth: theme.spacing(3),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: theme.spacing(0.25, 0.875),
								background: theme.palette.gradient2.main,
								borderRadius: 0.5
							})}
						>
							<Label> {guideline.id} </Label>
						</Box>
						<H4Title> {guideline.title} </H4Title>
					</Box>
					<Paragraph2> {guideline.content} </Paragraph2>
				</Box>
			))}
		</Box>
	);
};
