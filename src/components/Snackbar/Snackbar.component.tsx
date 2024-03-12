import Stack from '@mui/material/Stack';
import { SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef, useContext } from 'react';
import { SnackbarProps } from './Snackbar.types';
import { H4Title, Paragraph2 } from '../Typography';
import { Icon } from '../Icon';
import { ButtonBase } from '@mui/material';
import { ColorModeContext } from 'src/contexts';
import { Icons } from '../icons';

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(({ id, type, message, headerMsg }, ref) => {
	const { closeSnackbar } = useSnackbar();
	const { theme } = useContext(ColorModeContext);

	const getColorAndIcon = (): { color: string; icon: Icons } => {
		switch (type) {
			case 'success':
				return {
					color: theme.palette.success.main,
					icon: 'verified'
				};
			case 'error':
				return {
					color: theme.palette.error.main,
					icon: 'alert'
				};
			case 'warning':
				return {
					color: theme.palette.warning.main,
					icon: 'alert'
				};
			default:
				return {
					color: theme.palette.system.icon,
					icon: 'notification'
				};
		}
	};

	const { color, icon } = getColorAndIcon();

	return (
		<SnackbarContent ref={ref}>
			<Stack
				component={ButtonBase}
				onClick={() => closeSnackbar(id)}
				gap={1}
				direction="row"
				alignItems="flex-start"
				justifyContent="flex-start"
				sx={{
					backgroundColor: theme => theme.palette.dark[500],
					borderRadius: 2,
					position: 'relative',
					padding: 1.5,
					maxWidth: 360,
					minWidth: 360,
					minHeight: 65,
					width: '100%',
					border: theme => `${theme.spacing(0.125)} solid ${color}`
				}}
			>
				<Stack
					padding={1}
					alignItems="center"
					justifyContent="center"
					sx={{
						borderRadius: 1,
						background: color
					}}
				>
					<Icon icon={icon} sx={{ color: theme => theme.palette.dark[900] }} fontSize="large" />
				</Stack>
				<Stack alignItems="flex-start">
					{headerMsg && <H4Title>{headerMsg}</H4Title>}
					<Paragraph2 sx={{ wordBreak: 'break-word', textAlign: 'left' }}>{message}</Paragraph2>
				</Stack>
			</Stack>
		</SnackbarContent>
	);
});
