import Stack from '@mui/material/Stack';
import { SecondaryButton } from '../Button';
import { Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import { FormHelperText } from '@mui/material';
import { icons } from 'src/components/icons';
import { MAX_FILE_SIZE } from 'src/constants/constants';
import { isValidFileSize } from 'src/helpers/file.helpers';
import { toast } from 'react-toastify';
import { Paragraph3, Label } from '../Typography';
import { useDevice } from 'src/hooks/useDevice';

export const FileField = ({
	name,
	maxSize = MAX_FILE_SIZE,
	label,
	btnLabel,
	isFullWidth = false,
	isDisabled = false,
	isButtonsOnNewField = false,
	isUploadInfoInRow = false
}: {
	name: string;
	maxSize?: number;
	label?: string;
	btnLabel?: string;
	isFullWidth?: boolean;
	isDisabled?: boolean;
	isButtonsOnNewField?: boolean;
	isUploadInfoInRow?: boolean;
}) => {
	const { iLg } = useDevice();

	const imageHeight = isFullWidth ? (iLg ? 110 : 160) : 80;
	const imageWidth = isFullWidth ? '100%' : 80;
	return (
		<Controller
			name={name}
			render={({ field, fieldState }) => {
				return (
					<Stack direction="column" spacing={1.5}>
						{label && <Label>{label}</Label>}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'flex-start',
								gap: theme => theme.spacing(isButtonsOnNewField && isUploadInfoInRow ? 1 : 2),
								alignItems: isButtonsOnNewField ? 'flex-start' : 'center',
								flexDirection: isButtonsOnNewField ? 'column' : 'row'
							}}
						>
							<Box
								height={imageHeight}
								width={imageWidth}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 1,
									border: field.value ? 'none' : theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
								}}
							>
								{field.value ? (
									<img
										height={imageHeight}
										width={imageWidth}
										src={field.value}
										alt="Cover"
										loading="lazy"
										style={{
											borderRadius: 'inherit',
											objectFit: 'cover'
										}}
									/>
								) : (
									<icons.uploadFile
										sx={theme => ({
											width: theme.spacing(4),
											height: theme.spacing(4),
											color: theme.palette.tertiary.main
										})}
									/>
								)}
							</Box>
							<Stack
								direction={isUploadInfoInRow ? 'row' : 'column'}
								alignItems={isUploadInfoInRow ? 'center' : 'initial'}
								spacing={1.5}
							>
								<Stack direction="row" alignItems="center" spacing={1}>
									<SecondaryButton component="label" size="small" disabled={isDisabled}>
										{btnLabel || 'Upload image'}
										<input
											hidden
											accept="image/*"
											multiple
											type="file"
											onChange={e => {
												const files = e.target.files;

												if (!files?.length) return;
												const file = files[0];
												if (!isValidFileSize(file, maxSize)) {
													toast.error(`You cannot upload a file exceeding ${maxSize} MB`, { theme: 'colored' });
													return;
												}

												const preview = URL.createObjectURL(file);
												field.onChange(preview);
												e.target.value = '';
											}}
										/>
									</SecondaryButton>
									{field.value && (
										<SecondaryButton
											disabled={isDisabled}
											size="small"
											startIcon="delete"
											onClick={() => field.onChange('')}
										/>
									)}
								</Stack>
								<Box sx={{ display: 'flex', gap: theme => theme.spacing(0.5) }}>
									<Paragraph3 color="text.secondary"> jpg/png </Paragraph3>
									<Paragraph3 color="text.secondary"> . </Paragraph3>
									<Paragraph3 color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
										max. size {maxSize}MB
									</Paragraph3>
								</Box>
							</Stack>
						</Box>
						{fieldState.error && fieldState.error.message ? (
							<FormHelperText error>{fieldState.error.message}</FormHelperText>
						) : null}
					</Stack>
				);
			}}
		/>
	);
};
