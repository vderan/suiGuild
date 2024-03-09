import { Button, styled } from '@mui/material';
import { icons } from 'src/components/icons';
import { ICustomButtonProps } from './Button.types';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';
import React from 'react';
import { CircularProgress } from '../Progress';

export const OutlineButton = ({
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	iconSize = 'small',
	endElement,
	loading = false,
	disabled = false,
	onClick,
	...props
}: ICustomButtonProps) => {
	const StartIcon = icons[startIcon as keyof typeof icons];
	const EndIcon = icons[endIcon as keyof typeof icons];

	return (
		<OutlineButtonContainer
			{...props}
			disabled={disabled || loading}
			onClick={onClick}
			startIcon={
				!loading ? (
					startIcon ? (
						<StartIcon fontSize={iconSize} sx={{ color: theme => theme.palette.text.secondary }} />
					) : startImage ? (
						<img src={startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<EndIcon fontSize={iconSize} sx={{ color: theme => theme.palette.text.secondary }} />
					) : endImage ? (
						<img src={endImage} alt="endImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : endElement ? (
						<>{React.cloneElement(endElement)}</>
					) : undefined
				) : undefined
			}
		>
			{loading ? <CircularProgress color="inherit" size={20} /> : null}
			{children}
		</OutlineButtonContainer>
	);
};

const OutlineButtonContainer = styled(Button)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	padding: theme.spacing(0.875, 1.875, 0.875, 0.875),
	border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
	borderRadius: theme.spacing(1),
	gap: theme.spacing(0.5),
	fontFamily: 'Exo',
	fontWeight: 400,
	lineHeight: theme.spacing(2.45),
	fontSize: theme.spacing(1.75),
	textTransform: 'none',
	minWidth: 'initial',
	whiteSpace: 'nowrap',
	color: theme.palette.text.secondary,
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
