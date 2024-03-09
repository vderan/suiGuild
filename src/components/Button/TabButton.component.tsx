import { Button } from '@mui/material';
import { icons } from 'src/components/icons';
import { CircularProgress } from 'src/components/Progress';
import { Tooltip } from 'src/components/Tooltip';
import { ICustomButtonProps } from './Button.types';
import { styled } from '@mui/material/styles';
import { BUTTON_ICON_SIZE, SPACING } from 'src/constants/theme.constants';

export const TabButton = ({
	disabled = false,
	thickness = 'thin',
	loading = false,
	tooltip,
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	isFocused = false,
	onClick,
	...props
}: ICustomButtonProps & { component?: React.ReactNode }) => {
	const StartIcon = icons[startIcon as keyof typeof icons];
	const EndIcon = icons[endIcon as keyof typeof icons];

	const button = (
		<TabButtonContainer
			disabled={disabled || loading}
			thickness={thickness}
			onClick={onClick}
			isFocused={isFocused}
			startIcon={
				!loading ? (
					startIcon ? (
						<StartIcon
							sx={{ color: theme => (isFocused ? theme.palette.text.primary : theme.palette.border.highlight) }}
							fontSize="small"
						/>
					) : startImage ? (
						<img src={startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<EndIcon
							sx={{ color: theme => (isFocused ? theme.palette.text.primary : theme.palette.border.highlight) }}
							fontSize="small"
						/>
					) : endImage ? (
						<img src={endImage} alt="endImg" width={BUTTON_ICON_SIZE} height="20px " />
					) : undefined
				) : undefined
			}
			{...props}
		>
			{loading ? <CircularProgress sx={{ marginRight: SPACING }} /> : null}
			{children}
		</TabButtonContainer>
	);

	return (
		<>{tooltip ? <Tooltip label={tooltip}>{disabled ? <span>{button}</span> : button}</Tooltip> : <>{button}</>}</>
	);
};

const TabButtonContainer = styled(Button, {
	shouldForwardProp: prop => prop !== 'isFocused'
})<{ disabled: boolean; thickness: string; isFocused: boolean }>(({ theme, disabled, thickness, isFocused }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	padding:
		thickness === 'thin' ? (isFocused ? theme.spacing(1.375, 1.625) : theme.spacing(1.25, 1.5)) : theme.spacing(1.5, 2),
	border: isFocused ? 'none' : `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
	borderRadius: theme.spacing(1),
	boxSizing: 'border-box',
	opacity: disabled ? 0.3 : 1,
	background: isFocused ? theme.palette.gradient2.main : 'none',
	fontFamily: 'Clash Display',
	fontStyle: 'normal',
	fontWeight: 600,
	fontSize: theme.spacing(1.75),
	textTransform: 'none',
	whiteSpace: 'nowrap',
	color: theme.palette.text.primary,
	'&:hover': {
		backgroundColor: theme.palette.dark[500]
	}
}));
