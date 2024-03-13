import { useState, useEffect } from 'react';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import { Icon } from 'src/components/Icon';
import { CountBadge } from 'src/components/Badge';
import { styled } from '@mui/material';
import { IToggleButtonGroupProps } from './ToggleButtonGroup.types';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';

export const CustomToggleButtonGroup = ({
	options,
	onChange,
	defaultValue = '',
	isDisabled = false,
	isEmitEmptyValue = false,
	sx
}: IToggleButtonGroupProps) => {
	const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

	useEffect(() => {
		setSelectedValue(defaultValue);
	}, [defaultValue]);

	const handleSelectionChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
		if (newValue !== null || isEmitEmptyValue) {
			const val = newValue || '';
			setSelectedValue(val);
			onChange?.(val);
		}
	};

	return (
		<StyledToggleButtonGroup
			sx={{ overflow: 'hidden', ...sx }}
			exclusive
			value={selectedValue}
			onChange={handleSelectionChange}
		>
			{options?.map(option => (
				<ToggleButton
					disabled={isDisabled}
					key={option.value}
					value={option.value}
					sx={{ width: option.width ? option.width : 'auto', overflow: 'hidden' }}
				>
					{option.startIcon ? (
						<Icon icon={option.startIcon} fontSize="small" />
					) : option.startImage ? (
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<img
								src={option.startImage}
								alt="startImg"
								width={BUTTON_ICON_SIZE}
								height={BUTTON_ICON_SIZE}
								style={{ borderRadius: '50%' }}
							/>
						</Box>
					) : (
						<></>
					)}
					<span className="toogle-button-group__label">{option.label}</span>
					{option.endIcon ? (
						<Icon icon={option.endIcon} fontSize="small" />
					) : option.endImage ? (
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<img
								src={option.endImage}
								alt="endImg"
								width={BUTTON_ICON_SIZE}
								height={BUTTON_ICON_SIZE}
								style={{ borderRadius: '50%' }}
							/>
						</Box>
					) : (
						<></>
					)}
					{option.countNum && <CountBadge count={option.countNum} />}
				</ToggleButton>
			))}
		</StyledToggleButtonGroup>
	);
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	gap: theme.spacing(0.5),
	borderRadius: 0,
	'& .MuiToggleButtonGroup-grouped': {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: theme.spacing(0.875, 1.5),
		gap: theme.spacing(1),
		border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
		background: theme.palette.surface.buttonBg,
		fontFamily: 'Clash Display',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: theme.spacing(1.75),
		textTransform: 'none',
		whiteSpace: 'nowrap',
		color: theme.palette.text.primary,
		lineHeight: theme.spacing(3),
		'& .MuiSvgIcon-root': {
			color: theme.palette.border.highlight
		},
		'&.Mui-disabled': {
			border: 0,
			color: theme.palette.text.primary,
			opacity: 0.5
		},
		'&:not(:first-of-type)': {
			border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
			borderRadius: theme.spacing(1),
			marginLeft: 0
		},
		'&:first-of-type': {
			border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
			borderRadius: theme.spacing(1)
		},
		'&.Mui-selected': {
			background: theme.palette.gradient.secondary,
			border: 'none',
			color: theme.palette.buttonText.white,
			'& .MuiSvgIcon-root': {
				color: theme.palette.surface.iconBtn
			}
		},
		'&:hover': {
			borderColor: theme.palette.border.highlight,
			backgroundColor: theme.palette.surface.buttonBg
		},
		'& .toogle-button-group__label': {
			textOverflow: 'ellipsis',
			overflow: 'hidden'
		}
	}
}));
