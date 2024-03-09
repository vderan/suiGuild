import { SxProps, Theme } from '@mui/material';
import { Icons } from 'src/components/icons';

export interface IInputFieldProps {
	label?: string;
	name: string;
	type?: string;
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	fullWidth?: boolean;
	width?: string;
	size?: 'small' | 'medium';
	readOnly?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	startElement?: JSX.Element;
	endImage?: string;
	endElement?: JSX.Element;
	autoFocus?: boolean;
	isAdornmentCentered?: boolean;
	trim?: boolean;
	onChange?: (value: string) => void;
	onKeyPress?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	multiline?: boolean;
	multilineRows?: number;
	maxMultilineRows?: number;
	maxLength?: number;
	trailingDigits?: number;
	maxAmount?: string;
	minAmount?: string;
	boxSx?: SxProps<Theme>;
}
export interface StandaloneInputFieldProps extends Omit<IInputFieldProps, 'onChange'> {
	value: string;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}
