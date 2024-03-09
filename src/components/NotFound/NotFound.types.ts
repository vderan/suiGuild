import { StackProps, SvgIconProps } from '@mui/material';
export interface INotFoundProps extends StackProps {
	title?: string;
	description?: string;
	iconProps?: SvgIconProps;
	isSmall?: boolean;
}
