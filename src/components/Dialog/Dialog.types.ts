import { SxProps, Theme } from '@mui/system';
export interface IDialogProps {
	title?: string;
	width?: 'sm' | 'md' | 'lg' | 'xl' | 'dialogMedium' | 'dialogSmall' | 'dialogLarge' | 'dialogExtraSmall';
	open: boolean;
	onConfirmText?: string;
	onCancelText?: string;
	isConfirmDisabled?: boolean;
	isConfirmLoading?: boolean;
	isCancelDisabled?: boolean;
	isCancelLoading?: boolean;
	onConfirm?: () => void;
	onClose: () => void;
	nofooter?: boolean;
	isConfirmation?: boolean;
	sx?: SxProps<Theme>;
	actions?: JSX.Element;
}
