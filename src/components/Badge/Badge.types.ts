import { BadgeProps } from '@mui/material';

export interface IBadgeProps extends BadgeProps {
	isOnline?: boolean;
	badgeContent?: string;
}
