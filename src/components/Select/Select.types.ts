import { SxProps, Theme } from '@mui/system';
import { Icons } from 'src/components/icons';

export interface ISelectProps {
	options: ISelectOption[];
	name: string;
	label?: string;
	fullWidth?: boolean;
	onChange?: (value: string) => void;
	required?: boolean;
	disabled?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	placeholder?: string;
	sxMenuItem?: SxProps<Theme>;
	boxSx?: SxProps<Theme>;
}

export interface ISelectOption {
	id: string;
	avatar?: string;
	label: string;
	value: string;
}

export interface StandaloneSelectProps extends ISelectProps {
	errorMessage?: string;
	value?: string;
}
