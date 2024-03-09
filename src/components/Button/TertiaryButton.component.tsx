import { Icons, icons } from 'src/components/icons';
import { CircularProgress } from 'src/components/Progress';
import { Tooltip } from 'src/components/Tooltip';
import { ICustomButtonProps } from './Button.types';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';
import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';

const Icon = ({ iconName, size }: { iconName: Icons; size: 'inherit' | 'large' | 'medium' | 'small' }) => {
	const Icon = icons[iconName];
	return (
		<Icon
			fontSize={size}
			sx={{
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
				}
			}}
		/>
	);
};

export const TertiaryButton = ({
	disabled = false,
	size = 'medium',
	loading = false,
	tooltip,
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	iconSize,
	onClick,
	sx
}: ICustomButtonProps) => {
	const isOnlyIcon = Boolean(startIcon || endIcon || startImage || endImage) && !children;
	const button = (
		<TertiaryButtonContainer
			sx={sx}
			disabled={disabled || loading}
			size={size}
			isOnlyIcon={isOnlyIcon}
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
		>
			{loading ? <CircularProgress /> : null}
			<Box
				sx={{
					background: theme => theme.palette.gradient1.main,
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					WebkitBoxDecorationBreak: 'clone'
				}}
			>
				{children}
			</Box>
		</TertiaryButtonContainer>
	);

	return (
		<>{tooltip ? <Tooltip label={tooltip}>{disabled ? <span>{button}</span> : button}</Tooltip> : <>{button}</>}</>
	);
};

const TertiaryButtonContainer = styled(Button, {
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
		borderRadius: theme.spacing(1),
		opacity: disabled ? 0.5 : 1,
		background: theme.palette.tertiary.main,
		fontFamily: 'Clash Display',
		fontStyle: 'normal',
		fontWeight: 600,
		gap: theme.spacing(1),
		minWidth: 'initial',
		fontSize: isSmall ? theme.spacing(1.5) : isLarge ? theme.spacing(2) : theme.spacing(1.75),
		lineHeight: isSmall ? theme.spacing(2.5) : theme.spacing(3),
		textTransform: 'none',
		'&::after': {
			content: '""',
			position: 'absolute',
			inset: 0,
			padding: theme.spacing(0.125),
			borderRadius: theme.spacing(1),
			background: 'transparent',
			WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
			WebkitMaskComposite: 'xor',
			maskComposite: 'exclude'
		},
		'&:focus': {
			'&::after': {
				background: theme.palette.gradient1.main,
				padding: theme.spacing(0.25)
			}
		},
		'&:hover': {
			background: theme.palette.tertiary.main,
			boxShadow: `${theme.spacing(0, 1, 2, 0)} ${theme.palette.shadow.main}`,
			'&::after': {
				padding: theme.spacing(0.125),
				background: theme.palette.gradient1.main
			}
		},
		'&:active': {
			background: 'transparent',
			boxShadow: 'none',
			'&::after': {
				padding: theme.spacing(0.125)
			}
		},
		'& .MuiButton-startIcon': {
			margin: 0
		},
		'& .MuiButton-endIcon': {
			margin: 0
		}
	};
});
