import { ButtonProps } from '@mui/material/Button';
import { Icons } from 'src/components/icons';

export interface ICustomButtonProps extends ButtonProps {
	isFocused?: boolean;
	flexoption?: 'start' | 'center';
	disabled?: boolean;
	thickness?: 'thick' | 'thin' | 'middle';
	size?: 'large' | 'medium' | 'small';
	tooltip?: string;
	loading?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	endImage?: string;
	endElement?: JSX.Element;
	iconSize?: 'inherit' | 'large' | 'medium' | 'small';
}
