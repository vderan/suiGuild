import { useState } from 'react';
import { useSnackbar } from './useSnackbar';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export const useClipboard = () => {
	const [copiedText, setCopiedText] = useState<CopiedValue>(null);
	const { successSnackbar, closeSnackbar } = useSnackbar();
	const copy: CopyFn = async text => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported');
			return false;
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			closeSnackbar();

			await navigator.clipboard.writeText(text);
			setCopiedText(text);

			successSnackbar('Copied!');

			return true;
		} catch (error) {
			console.warn('Copy failed', error);
			setCopiedText(null);
			return false;
		}
	};

	return { copiedText, copy };
};
