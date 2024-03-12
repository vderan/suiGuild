import { Box, Button } from '@mui/material';
import { Icons, icons } from 'src/components/icons';
import { CircularProgress } from 'src/components/Progress';
import { Tooltip } from 'src/components/Tooltip';
import { ICustomButtonProps } from './Button.types';
import { styled } from '@mui/material/styles';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from 'src/contexts';
import { useContext } from 'react';

type ButtonProps = ICustomButtonProps & { component?: React.ElementType; loaderSize?: number };

const Icon = ({ iconName, size }: { iconName: Icons; size: 'inherit' | 'large' | 'medium' | 'small' }) => {
	const Icon = icons[iconName];
	const { theme } = useContext(ColorModeContext);

	return (
		<Icon
			fontSize={size}
			sx={{
				...(theme.palette.mode === 'light' && {
					'path[fill]': {
						fill: 'url(#svgGradient1)'
					},
					'path[stroke]': {
						stroke: 'url(#svgGradientStroke)'
					},
					'circle[fill]': {
						fill: 'url(#svgGradient1)'
					},
					'circle[stroke]': {
						stroke: 'url(#svgGradientStroke)'
					},
					'rect[fill]': {
						fill: 'url(#svgGradient1)'
					},
					'rect[stroke]': {
						stroke: 'url(#svgGradientStroke)'
					}
				}),
				...(theme.palette.mode === 'dark' && {
					color: theme => theme.palette.system.default
				})
			}}
		/>
	);
};

export const SecondaryButton = ({
	disabled = false,
	loading = false,
	tooltip,
	size = 'medium',
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	sx,
	iconSize,
	onClick,
	loaderSize,
	...props
}: ButtonProps) => {
	const isOnlyIcon = Boolean(startIcon || endIcon || startImage || endImage) && !children;
	const { isDarkMode } = useContext(ColorModeContext);

	const button = (
		<SecondaryButtonContainer
			size={size}
			isOnlyIcon={isOnlyIcon}
			sx={sx}
			disabled={disabled || loading}
			onClick={e => {
				onClick?.(e);
				e.currentTarget.blur();
			}}
			startIcon={
				!loading ? (
					startIcon ? (
						<Icon iconName={startIcon} size={iconSize || size} />
					) : startImage ? (
						<img src={startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<Icon iconName={endIcon} size={iconSize || size} />
					) : endImage ? (
						<img src={endImage} alt="endImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : undefined
				) : undefined
			}
			{...props}
		>
			{loading ? <CircularProgress size={loaderSize} /> : null}
			{isDarkMode
				? children
				: children && (
						<Box
							sx={{
								background: theme => theme.palette.gradient.main,
								WebkitBackgroundClip: 'text',
								backgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								WebkitBoxDecorationBreak: 'clone'
							}}
						>
							{children}
						</Box>
				  )}
		</SecondaryButtonContainer>
	);

	return (
		<>{tooltip ? <Tooltip label={tooltip}>{disabled ? <span>{button}</span> : button}</Tooltip> : <>{button}</>}</>
	);
};

const SecondaryButtonContainer = styled(Button, {
	shouldForwardProp: prop => prop !== 'isOnlyIcon'
})<{ disabled: boolean; size: string; isOnlyIcon: boolean }>(({ theme, disabled, size, isOnlyIcon }) => {
	const isSmall = size === 'small';
	const isLarge = size === 'large';

	const paddings = () => {
		switch (size) {
			case 'small':
				return isOnlyIcon ? theme.spacing(0.75) : theme.spacing(0.75, 2);
			case 'medium':
				return isOnlyIcon ? theme.spacing(1) : theme.spacing(1, 3);
			case 'large':
				return isOnlyIcon ? theme.spacing(2) : theme.spacing(2, 4);
		}
	};
	return {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: paddings(),
		gap: theme.spacing(1),
		borderRadius: theme.spacing(1),
		opacity: disabled ? 0.5 : 1,
		fontFamily: 'Clash Display',
		fontStyle: 'normal',
		minWidth: 'initial',
		fontWeight: 600,
		fontSize: isSmall ? theme.spacing(1.5) : isLarge ? theme.spacing(2) : theme.spacing(1.75),
		lineHeight: isSmall ? theme.spacing(2.5) : theme.spacing(3),
		textTransform: 'none',
		whiteSpace: 'nowrap',
		color: theme.palette.system.default,
		position: 'relative',
		'&::after': {
			content: '""',
			position: 'absolute',
			inset: 0,
			padding: theme.spacing(0.125),
			borderRadius: theme.spacing(1),
			background: theme.palette.gradient.main,
			WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
			WebkitMaskComposite: 'xor',
			maskComposite: 'exclude'
		},
		'&:focus': {
			'&::after': {
				padding: theme.spacing(0.25)
			}
		},
		'&:hover': {
			backgroundColor: theme.palette.surface.buttonBg,
			boxShadow: `${theme.spacing(0, 1, 2, 0)} ${theme.palette.shadow.main}`,
			'&::after': {
				padding: theme.spacing(0.125),
				background: theme.palette.system.default
			}
		},
		'&:active': {
			...(theme.palette.mode === 'dark' && {
				background: theme.palette.border.subtle
			}),
			'&::after': {
				padding: theme.spacing(0.125),
				background: theme.palette.gradient.main
			}
		},
		'& .MuiButton-startIcon': {
			margin: 0
		},
		'& .MuiButton-endIcon': {
			margin: 0
		},
		'&.Mui-disabled': {
			color: theme.palette.system.default
		}
	};
});

export const LinkSecondaryButton = (props: ButtonProps & { to: string }) => {
	return <SecondaryButton {...props} component={NavLink} />;
};
