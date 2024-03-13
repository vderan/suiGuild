import { Controller } from 'react-hook-form';
import { Box, Stack, alpha } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import { Icon } from 'src/components/Icon';
import { SmallAvatar } from 'src/components/Avatar';
import slugify from 'slugify';
import { ISelectProps, StandaloneSelectProps } from './Select.types';
import { Paragraph2, Label } from '../Typography';
import { icons } from '../icons';

export const StandaloneSelect = ({
	name,
	label,
	options = [],
	onChange,
	startIcon,
	placeholder = 'Choose an option',
	endIcon,
	fullWidth,
	disabled = false,
	sxMenuItem,
	value,
	errorMessage,
	boxSx
}: StandaloneSelectProps) => {
	const labelId = `${slugify(name)}-label`;

	return (
		<Stack
			direction="column"
			spacing={1}
			sx={{
				position: 'relative',
				...boxSx
			}}
		>
			{label ? <Label>{label}</Label> : null}
			<MuiSelect
				fullWidth={fullWidth}
				id={labelId}
				error={Boolean(errorMessage)}
				sx={{
					'& > .MuiSvgIcon-root': {
						color: theme => theme.palette.border.highlight
					}
				}}
				MenuProps={{
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left'
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left'
					},
					elevation: 0
				}}
				IconComponent={icons.chevronDown}
				variant="outlined"
				displayEmpty
				renderValue={value => {
					if (!value) {
						return (
							<Box
								component="span"
								sx={{ color: theme => theme.palette.text.primary, opacity: 0.5, fontFamily: 'Exo' }}
							>
								{placeholder}
							</Box>
						);
					}
					const selectedOption = options.find(option => option.id === value);
					return (
						<Stack direction="row" overflow="hidden" gap={1} alignItems="center">
							{selectedOption?.avatar && <SmallAvatar image={selectedOption.avatar} />}
							<Paragraph2 noWrap>{selectedOption?.label}</Paragraph2>
						</Stack>
					);
				}}
				startAdornment={
					startIcon ? (
						<InputAdornment position="start">
							<Icon icon={startIcon} sx={{ color: theme => theme.palette.border.highlight }} />
						</InputAdornment>
					) : null
				}
				endAdornment={
					endIcon ? (
						<InputAdornment position="end">
							<Icon icon={endIcon} sx={{ color: theme => theme.palette.border.highlight }} />
						</InputAdornment>
					) : null
				}
				value={value}
				disabled={disabled}
				onChange={e => {
					onChange?.(e.target.value as string);
				}}
			>
				{options.map(option => (
					<MenuItem
						key={option.id}
						value={option.id}
						sx={{
							'&:not(:last-child)': {
								borderBottom: theme => `1px solid ${theme.palette.border.subtle}`
							},
							'&:hover': {
								background: 'transparent'
							},
							'&.Mui-selected:hover': {
								background: 'transparent'
							},
							'&.Mui-selected': {
								background: 'transparent'
							},
							...sxMenuItem
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								overflow: 'hidden'
							}}
						>
							{option.avatar && <SmallAvatar image={option.avatar} />}
							<Paragraph2
								noWrap
								sx={{
									color: theme => alpha(theme.palette.text.primary, 0.5),
									'.Mui-selected &': {
										color: theme => theme.palette.primary.main
									},
									'.Mui-selected.MuiMenuItem-root:hover &': {
										color: theme => theme.palette.primary.main
									},
									'.MuiMenuItem-root:hover &': {
										color: theme => theme.palette.text.primary
									}
								}}
							>
								{option.label}
							</Paragraph2>
						</Box>
					</MenuItem>
				))}
			</MuiSelect>
			{errorMessage ? <FormHelperText error>{errorMessage}</FormHelperText> : null}
		</Stack>
	);
};

export const Select = ({ name, required, onChange, ...props }: ISelectProps) => {
	return (
		<Controller
			name={name}
			rules={{ required }}
			render={({ field, fieldState }) => {
				return (
					<StandaloneSelect
						name={name}
						{...props}
						value={field.value}
						errorMessage={fieldState.error?.message}
						onChange={e => {
							field.onChange(e);
							onChange?.(e);
						}}
					/>
				);
			}}
		/>
	);
};
