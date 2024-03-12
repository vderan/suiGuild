import { CustomContentProps } from 'notistack';

export interface SnackbarProps extends CustomContentProps {
	type?: 'error' | 'success' | 'info' | 'warning';
	headerMsg?: string;
}
