import { SnackbarProvider as NotistackSnackbarProvider, SnackbarKey, useSnackbar } from 'notistack';
import { PropsWithChildren } from 'react';
import { IconButton } from 'src/components/IconButton';

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
	return (
		<NotistackSnackbarProvider maxSnack={4} action={snackbarId => <SnackbarCloseButton snackbarId={snackbarId} />}>
			{children}
		</NotistackSnackbarProvider>
	);
};

// Add a dismiss button on all snackbars
function SnackbarCloseButton({ snackbarId }: { snackbarId: SnackbarKey }) {
	const { closeSnackbar } = useSnackbar();

	return <IconButton icon="close" onClick={() => closeSnackbar(snackbarId)} />;
}
