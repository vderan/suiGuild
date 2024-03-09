import { useNavigate } from 'react-router-dom';
import { ButtonBase, Stack } from '@mui/material';
import { ButtonSmallText, H3Title } from 'src/components/Typography';
import { SendToken } from './components/SendToken';
import { Icon } from 'src/components/Icon';

export const Send = () => {
	const navigate = useNavigate();

	return (
		<Stack sx={{ pt: { xs: 3, lg: 5 }, gap: 4, maxWidth: '560px', mx: 'auto' }}>
			<ButtonBase sx={{ gap: 0.5, width: 'max-content' }} onClick={() => navigate(-1)}>
				<Icon icon="chevronLeft" sx={{ color: theme => theme.palette.text.secondary }} />
				<ButtonSmallText color="text.secondary">Go back</ButtonSmallText>
			</ButtonBase>

			<Stack gap={3}>
				<H3Title>Send</H3Title>
				<SendToken />
			</Stack>
		</Stack>
	);
};
