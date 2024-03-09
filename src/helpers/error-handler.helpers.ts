import { toast } from 'react-toastify';

export class ErrorHandler {
	static process(error: Error | unknown, message = ''): void {
		if (!error || !(error instanceof Error)) return;
		const msg = message || ErrorHandler._getErrorMsg(error);
		toast.error(msg, { theme: 'colored' });

		ErrorHandler.processWithoutFeedback(error);
	}

	static processWithoutFeedback(error: Error | unknown): void {
		if (!error || !(error instanceof Error)) return;
		console.error({ error });
	}

	static _getErrorMsg(error: Error): string {
		switch (error.constructor) {
			default:
				return error.message;
		}
	}
}
