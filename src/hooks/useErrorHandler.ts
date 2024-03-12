import { useSnackbar } from './useSnackbar';

export const useErrorHandler = () => {
	const { errorSnackbar } = useSnackbar();

	const _getErrorMsg = (error: Error) => {
		switch (error.constructor) {
			default:
				return error.message;
		}
	};

	const processWithoutFeedback = (error: Error | unknown) => {
		if (!error || !(error instanceof Error)) return;
		console.error({ error });
	};
	return {
		errorProcess: (error: Error | unknown, message = '') => {
			if (!error || !(error instanceof Error) || error.message === 'Rejected from user') return;
			const msg = message || _getErrorMsg(error);
			errorSnackbar(msg);
			processWithoutFeedback(error);
		},
		errorProcessWithoutFeedback: processWithoutFeedback
	};
};
