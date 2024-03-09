import { IconButtonProps } from '@mui/material/IconButton';
import { Icons } from 'src/components/icons';
import { SxProps, Theme } from '@mui/system';

export interface ICustomIconButtonProps extends Omit<IconButtonProps, 'color'> {
	icon: Icons;
	loading?: boolean;
	label?: string;
	iconSx?: SxProps<Theme>;
}
