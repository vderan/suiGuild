import { Button } from '@mui/material';
import { icons } from 'src/components/icons';
import { ICustomButtonProps } from './Button.types';
import { styled } from '@mui/system';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';

export const MenuButton = ({
	isFocused = false,
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	onClick
}: ICustomButtonProps) => {
	const StartIcon = icons[startIcon as keyof typeof icons];
	const EndIcon = icons[endIcon as keyof typeof icons];

	return (
		<MenuButtonContainer
			isFocused={isFocused}
			onClick={onClick}
			startIcon={
				startIcon ? (
					<StartIcon fontSize="small" />
				) : startImage ? (
					<img src={startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
				) : undefined
			}
			endIcon={
				endIcon ? (
					<EndIcon fontSize="small" />
				) : endImage ? (
					<img src={endImage} alt="endImg" width={BUTTON_ICON_SIZE} height="20px " />
				) : undefined
			}
		>
			{children}
		</MenuButtonContainer>
	);
};

const MenuButtonContainer = styled(Button, {
	shouldForwardProp: prop => prop !== 'isFocused'
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	padding: theme.spacing(1),
	gap: theme.spacing(1),
	minWidth: 'initial',
	boxSizing: 'border-box',
	width: '100%',
	'& .MuiSvgIcon-root': {
		color: theme.palette.text.primary
	},
	'& .MuiButton-startIcon': {
		margin: 0,
		opacity: isFocused ? 1 : 0.5
	},
	borderRadius: theme.spacing(1),
	background: isFocused ? theme.palette.gradient2.main : null,
	fontFamily: 'Clash Display',
	fontStyle: 'normal',
	fontWeight: 600,
	fontSize: theme.spacing(1.75),
	textTransform: 'none',
	whiteSpace: 'nowrap',
	color: theme.palette.text.primary,
	'&:acive': {
		background: theme.palette.gradient2.main
	}
}));
