import { Switch, SwitchProps, styled, Box } from '@mui/material';
import CheckIcon from '../Icons/CheckIcon';

export const SwitchField = ({ ...props }: SwitchProps) => {
	return (
		<SwitchContanier
			{...props}
			disableRipple
			checkedIcon={
				<Box
					sx={theme => ({
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: theme.spacing(2.5),
						height: theme.spacing(2.5),
						position: 'absolute',
						top: theme.spacing(0.125),
						borderRadius: '50%',
						backgroundColor: props.disabled ? theme.palette.border.default : theme.palette.success.main,
						right: theme.spacing(-0.375)
					})}
				>
					<CheckIcon fontSize="extraSmall" />
				</Box>
			}
		/>
	);
};

const SwitchContanier = styled(Switch)(({ theme, checked, disabled }) => ({
	padding: 0,
	width: theme.spacing(5.5),
	height: theme.spacing(3),
	borderRadius: theme.spacing(3),
	border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
	'&:hover': {
		borderColor: disabled ? theme.palette.border.default : theme.palette.tertiary.main
	},
	'.MuiSwitch-switchBase': {
		height: '100%',
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	'& .MuiSwitch-input': {
		width: '400%'
	},
	'& .MuiSwitch-thumb': {
		color: disabled ? theme.palette.border.default : theme.palette.error.main,
		width: theme.spacing(2.5),
		height: theme.spacing(2.5),
		position: 'absolute',
		top: theme.spacing(0.125),
		left: checked ? 'auto' : theme.spacing(0.125),
		boxShadow: 'none'
	},
	'& .MuiSwitch-track': { backgroundColor: 'transparent!important', opacity: 1 }
}));
