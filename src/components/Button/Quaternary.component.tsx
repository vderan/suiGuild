import { Button, styled } from '@mui/material';
import { icons } from 'src/components/icons';
import { ICustomButtonProps } from './Button.types';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';
import React from 'react';
import { CircularProgress } from '../Progress';

export const QuaternaryButton = ({
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	iconSize,
	endElement,
	loading = false,
	disabled = false,
	onClick,
	...props
}: ICustomButtonProps) => {
	const StartIcon = icons[startIcon as keyof typeof icons];
	const EndIcon = icons[endIcon as keyof typeof icons];

	return (
		<QuaternaryButtonContainer
			{...props}
			disabled={disabled || loading}
			onClick={onClick}
			startIcon={
				!loading ? (
					startIcon ? (
						<StartIcon fontSize={iconSize} sx={{ color: theme => theme.palette.tertiary.main }} />
					) : startImage ? (
						<img src={startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<EndIcon fontSize={iconSize} sx={{ color: theme => theme.palette.tertiary.main }} />
					) : endImage ? (
						<img src={endImage} alt="endImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : endElement ? (
						<>{React.cloneElement(endElement)}</>
					) : undefined
				) : undefined
			}
		>
			{loading ? <CircularProgress size={12} color="inherit" /> : null}
			{children}
		</QuaternaryButtonContainer>
	);
};

const QuaternaryButtonContainer = styled(Button)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	padding: theme.spacing(0.375, 1.875),
	border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
	borderRadius: theme.spacing(5.5),
	gap: theme.spacing(1),
	background: theme.palette.border.subtle,
	fontFamily: 'Clash Display',
	fontStyle: 'normal',
	fontWeight: 700,
	minWidth: 'initial',
	lineHeight: theme.spacing(1.5),
	fontSize: theme.spacing(1.25),
	letterSpacing: '0.15em',
	textTransform: 'none',
	color: theme.palette.text.primary,
	'& .MuiButton-startIcon': {
		margin: 0
	},
	'& .MuiButton-endIcon': {
		margin: 0
	},
	'&.Mui-disabled': {
		color: theme.palette.text.primary,
		opacity: 0.5
	}
}));
