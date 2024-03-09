import { Icons } from 'src/components/icons';
import { SxProps, Theme } from '@mui/system';

export interface IToggleButtonGroupProps {
	options: IToggleBtnOption[];
	onChange?: (value: string) => void;
	defaultValue?: string;
	isDisabled?: boolean;
	sx?: SxProps<Theme>;
}

export interface IToggleBtnOption {
	id: string;
	value: string;
	label: string;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	endImage?: string;
	countNum?: string;
	width?: string;
}
