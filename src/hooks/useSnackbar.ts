import { SnackbarKey, useSnackbar as useNotistackSnackbar, OptionsWithExtraProps } from 'notistack';

export const useSnackbar = () => {
	const { enqueueSnackbar, closeSnackbar } = useNotistackSnackbar();

	return {
		errorSnackbar: (message: string, options?: OptionsWithExtraProps<'toast'>) =>
			enqueueSnackbar(message, { variant: 'toast', headerMsg: 'Error', type: 'error', ...options }),
		successSnackbar: (message: string, options?: OptionsWithExtraProps<'toast'>) =>
			enqueueSnackbar(message, { variant: 'toast', headerMsg: 'Success', type: 'success', ...options }),
		infoSnackbar: (message: string, options?: OptionsWithExtraProps<'toast'>) =>
			enqueueSnackbar(message, { variant: 'toast', headerMsg: 'Info', type: 'info', ...options }),
		warningSnackbar: (message: string, options?: OptionsWithExtraProps<'toast'>) =>
			enqueueSnackbar(message, { variant: 'toast', headerMsg: 'Alert', type: 'warning', ...options }),
		/**
		 * Close snackbar. If no key is provided, all snackbars will be closed.
		 */
		closeSnackbar: (key?: SnackbarKey) => closeSnackbar(key)
	};
};
