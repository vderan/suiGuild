import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { FormHelperText, Stack } from '@mui/material';
import { TextField } from '@mui/material';
import slugify from 'slugify';
import { Controller } from 'react-hook-form';
import { IInputFieldProps, StandaloneInputFieldProps } from './InputField.types';
import { SmallAvatar, MediumAvatar } from 'src/components/Avatar';
import { Label } from '../Typography';
import { Icon } from '../Icon';
import { normalizeDecimalPrecision, normalizeRange } from 'src/helpers/number.helpers';

export const StandaloneInputField = React.forwardRef<HTMLInputElement, StandaloneInputFieldProps>(
	(
		{
			label,
			name,
			type = 'text',
			disabled = false,
			placeholder,
			startIcon,
			endIcon,
			startImage,
			startElement,
			endImage,
			endElement,
			fullWidth,
			width,
			size = 'small',
			autoFocus = false,
			onChange,
			onBlur,
			onPaste,
			maxLength,
			multiline = false,
			multilineRows = 4,
			maxMultilineRows,
			onKeyPress,
			value,
			error,
			boxSx,
			isAdornmentCentered = true
		}: StandaloneInputFieldProps,
		ref
	) => {
		const id = `${slugify(name)}-id`;

		return (
			<Stack
				direction="column"
				spacing={1}
				sx={{
					position: 'relative',
					width: '100%',
					...boxSx
				}}
			>
				{label ? <Label>{label}</Label> : null}
				<Stack position="relative">
					<TextField
						id={id}
						type={type === 'password' ? 'password' : type}
						placeholder={placeholder}
						error={Boolean(error)}
						helperText={error ? error : undefined}
						size={size}
						fullWidth={fullWidth}
						variant="outlined"
						multiline={multiline}
						rows={multiline && !maxMultilineRows ? multilineRows : undefined}
						maxRows={maxMultilineRows}
						inputRef={ref}
						InputProps={{
							inputProps: {
								inputMode: type === 'number' ? 'numeric' : undefined,
								pattern: type === 'number' ? '[0-9]*' : undefined,
								maxLength,
								autoFocus,
								sx: {
									alignItems: isAdornmentCentered ? 'center' : 'flex-start',
									textOverflow: 'ellipsis',
									paddingRight: !multiline && maxLength ? '56px !important;' : undefined
								}
							},
							sx: {
								paddingBottom: multiline && maxLength ? '19px !important;' : undefined,

								fontFamily: 'Exo',
								'& input[type=number]': {
									MozAppearance: 'textfield'
								},
								'& input[type=number]::-webkit-outer-spin-button': {
									WebkitAppearance: 'none',
									margin: 0
								},
								'& input[type=number]::-webkit-inner-spin-button': {
									WebkitAppearance: 'none',
									margin: 0
								},
								alignItems: 'flex-start',
								width: width
							},
							startAdornment: startIcon ? (
								<InputAdornment position="start">
									<Icon icon={startIcon} sx={{ color: theme => theme.palette.border.highlight }} />
								</InputAdornment>
							) : startImage ? (
								<InputAdornment position="start">
									<SmallAvatar image={startImage} />
								</InputAdornment>
							) : startElement ? (
								<InputAdornment position="start">{React.cloneElement(startElement)}</InputAdornment>
							) : null,
							endAdornment: endIcon ? (
								<InputAdornment position="end">
									<Icon icon={endIcon} sx={{ color: theme => theme.palette.border.highlight }} />
								</InputAdornment>
							) : endImage ? (
								<InputAdornment position="end">
									<MediumAvatar image={endImage} />
								</InputAdornment>
							) : endElement ? (
								<InputAdornment position="end">{React.cloneElement(endElement)}</InputAdornment>
							) : null
						}}
						value={value}
						onPaste={onPaste}
						onChange={onChange}
						disabled={disabled}
						onBlur={onBlur}
						onKeyDown={e => {
							if (onKeyPress && e.key === 'Enter') {
								onKeyPress(e);
							} else if (type === 'number') {
								['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
							}
						}}
					/>
					{maxLength ? (
						<FormHelperText
							sx={{
								position: 'absolute',
								color: 'text.primary',
								fontFamily: 'Exo',
								opacity: 0.5,
								marginTop: '0!important',
								top: theme => (multiline ? `calc(${multilineRows * 19}px + 5px)` : theme.spacing(1.5)),
								right: theme => theme.spacing(1.5)
							}}
						>
							{value.length} / {maxLength}
						</FormHelperText>
					) : null}
				</Stack>
			</Stack>
		);
	}
);

export const InputField = (props: IInputFieldProps) => {
	const isTrimNeeded = props.trim || true;
	return (
		<Controller
			name={props.name}
			rules={{
				required: props.required
			}}
			render={({ field, fieldState }) => (
				<StandaloneInputField
					{...field}
					{...props}
					error={fieldState.error?.message}
					onChange={e => {
						let value = e.target.value;
						if (props.type === 'number') {
							value = normalizeDecimalPrecision(
								normalizeRange(e.target.value, props.maxAmount, props.minAmount),
								props.trailingDigits
							);
						}
						field.onChange(value);
						props.onChange?.(value);
					}}
					onPaste={e => {
						if (props.type === 'number') {
							e.preventDefault();
							const clipboardData = Number(e.clipboardData.getData('Text')).toLocaleString('fullwide', {
								useGrouping: false,
								maximumSignificantDigits: 20
							});
							const value = normalizeDecimalPrecision(
								normalizeRange(clipboardData, props.maxAmount, props.minAmount),
								props.trailingDigits
							);
							field.onChange(value);
							props.onChange?.(value);
						}
					}}
					onBlur={e => {
						if (isTrimNeeded) {
							const value = e.target.value.trim();
							field.onChange(value);
							props.onChange?.(value);
						}
					}}
				/>
			)}
		/>
	);
};
