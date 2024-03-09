import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import slugify from 'slugify';
import { Option, SelectAutocompleteSingleProps } from './SelectAutocomplete.types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Label } from '../Typography';
import { FormHelperText, Paper, PaperProps } from '@mui/material';

const CustomPaper = (props: PaperProps) => {
	return (
		<Paper
			{...props}
			elevation={0}
			sx={{
				backgroundColor: theme => theme.palette.dark[500],
				mt: 0.375,
				border: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.highlight}`,
				'& .MuiAutocomplete-listbox': {
					padding: 0
				},
				'& .MuiAutocomplete-option': {
					fontSize: theme => theme.spacing(1.75),
					color: 'rgba(255,255,255,0.5)',
					padding: theme => `${theme.spacing(1, 1.5)}!important`,
					'&:hover': {
						backgroundColor: 'transparent!important',
						color: theme => theme.palette.text.primary,
						'& .MuiTypography-root': {
							color: theme => theme.palette.text.primary
						}
					},
					'&.Mui-focused': {
						backgroundColor: 'transparent!important'
					},
					'&[aria-selected="true"].Mui-focused': {
						backgroundColor: 'transparent!important'
					},
					'&[aria-selected="true"]': {
						backgroundColor: 'transparent!important',
						color: theme => theme.palette.primary[700]
					},
					'&:not(:last-child)': {
						borderBottom: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
					},

					'& .MuiTypography-root': {
						color: 'rgba(255,255,255,0.5)'
					}
				},
				...props.sx
			}}
		/>
	);
};

export const SelectAutocomplete = ({
	name,
	label,
	options = [],
	onChange,
	required,
	disabled,
	isLoading = false,
	placeholder = 'Type to search...',
	fullWidth,
	PaperComponent,
	renderOption
}: SelectAutocompleteSingleProps) => {
	const { setValue: setFormValue, getValues } = useFormContext();

	const [value, setValue] = useState<Option | null>(null);
	const [inputValue, setInputValue] = useState('');
	const defaultFormValue = getValues(name) as string;

	useEffect(() => {
		if (options.length) {
			// Find the option that match the given defaultvalue in the formContext
			const option = options.find(option => option.id === defaultFormValue);

			if (option) {
				// Set the option as the selected option
				setValue({
					id: option.id,
					label: option.label
				});
			} else {
				setValue(null);
			}
			// Set the selected option's name value in the input field
			setInputValue(option?.label || '');
		}
	}, [defaultFormValue, options]);

	return (
		<Controller
			name={name}
			rules={{
				required
			}}
			render={({ field, fieldState }) => (
				<Stack
					direction="column"
					spacing={1}
					sx={{
						position: 'relative'
					}}
				>
					{label ? <Label>{label}</Label> : null}
					<Autocomplete
						value={value}
						clearOnBlur
						inputValue={inputValue}
						id={`${slugify(name)}-field`}
						options={options}
						disabled={disabled}
						groupBy={option => option.groupBy ?? ''}
						getOptionLabel={option => option.label}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						fullWidth={fullWidth}
						loading={isLoading}
						PaperComponent={PaperComponent || CustomPaper}
						renderOption={renderOption}
						renderInput={params => (
							<TextField
								placeholder={placeholder}
								sx={theme => ({
									color: theme.palette.text.primary,
									borderRadius: `${theme.spacing(1)} !important`,
									width: '100%',
									'& fieldset': {
										border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle} !important`,
										borderRadius: `${theme.spacing(1)} !important`
									},
									'&:hover fieldset': {
										borderColor: `${theme.palette.primary[300]} !important`
									},
									'&.Mui-focused fieldset': {
										// - Set the Input border when parent is focused
										borderColor: `${theme.palette.border.default} !important`
									},
									'& .MuiOutlinedInput-root': {
										'&.Mui-focused fieldset': {
											borderColor: `${theme.palette.border.default} !important`
										}
									},
									'& svg': {
										color: theme.palette.text.primary
									},
									'& .MuiSelect-select': {
										color: theme.palette.text.primary,
										opacity: 0.5,
										fontFamily: 'Exo',
										fontWeight: 400,
										fontSize: theme.spacing(1.75),
										lineHeight: '140%',
										padding: theme.spacing(1, 1.5)
									}
								})}
								{...params}
								label=""
								size="small"
								fullWidth
								error={Boolean(fieldState.error)}
								inputProps={{
									...params.inputProps,
									onKeyDown: e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}
								}}
							/>
						)}
						onChange={(_e, value) => {
							// Set value in the Autocomplete component
							setValue(value);
							// Set value in the formContext
							setFormValue(name, value ? value.id : value, { shouldValidate: true });
							// Execute custom onChange passed as a prop
							onChange?.(_e, value);
						}}
						onBlur={field.onBlur}
						onInputChange={(_e, value) => {
							setInputValue(value);
							if (!value) {
								// If no value if provided then pass a null value to the custom onChange
								onChange?.(_e, null);
							}
						}}
					/>
					{fieldState.error && fieldState.error.message ? (
						<FormHelperText error>{fieldState.error.message}</FormHelperText>
					) : null}
				</Stack>
			)}
		/>
	);
};
