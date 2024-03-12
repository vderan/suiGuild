import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';
import { PropsWithChildren } from 'react';
import { Snackbar } from 'src/components/Snackbar';

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
	return (
		<NotistackSnackbarProvider
			maxSnack={4}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			Components={{
				toast: Snackbar
			}}
		>
			{children}
		</NotistackSnackbarProvider>
	);
};
