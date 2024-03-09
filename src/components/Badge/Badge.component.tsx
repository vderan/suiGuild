import { useContext } from 'react';
import { ColorModeContext } from 'src/contexts';
import { Badge, Box } from '@mui/material';
import { IBadgeProps } from './Badge.types';

export const AlertBadge = ({ badgeContent, children, ...props }: IBadgeProps) => {
	const { theme } = useContext(ColorModeContext);
	return (
		<Badge
			badgeContent={Number(badgeContent)}
			color="error"
			max={99}
			sx={{
				...props.sx,
				'& .MuiBadge-badge': {
					fontSize: 8,
					fontWeight: 700,
					height: 12,
					width: 12,
					minWidth: 12,
					color: theme.palette.text.primary,
					top: 5,
					right: 5
				}
			}}
			{...props}
		>
			{children}
		</Badge>
	);
};

export const OnlineBadge = ({ isOnline = true, children, ...props }: IBadgeProps) => {
	return (
		<Badge
			color={isOnline ? 'success' : 'secondary'}
			badgeContent=""
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			sx={{
				...props.sx,
				'& .MuiBadge-badge': {
					height: 14,
					minWidth: 14,
					width: 14,
					right: 4,
					bottom: 4
				}
			}}
			{...props}
		>
			{children}
		</Badge>
	);
};

export const CountBadge = ({ count }: { count: string }) => {
	return (
		<Box
			sx={theme => ({
				fontSize: 12,
				fontWeight: 700,
				color: theme.palette.primary[500],
				background: theme.palette.border.subtle,
				borderRadius: 1,
				whiteSpace: 'nowrap',
				padding: theme.spacing(0.125, 0.625),
				border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
			})}
		>
			{count}
		</Box>
	);
};
