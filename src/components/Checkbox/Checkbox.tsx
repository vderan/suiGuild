import { Checkbox as MuiCheckbox, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { Paragraph2 } from '../Typography';

export const Checkbox = ({
	name,
	label,
	disabled,
	onChange
}: {
	label: string;
	name: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}) => {
	return (
		<FormGroup row>
			<FormControlLabel
				sx={{
					lineHeight: 1,
					opacity: disabled ? 0.7 : 1,
					gap: 1,
					margin: 0
				}}
				control={
					<Controller
						name={name}
						render={({ field }) => (
							<MuiCheckbox
								inputProps={{ 'aria-labelledby': `${slugify(name)}-checkbox` }}
								disabled={disabled}
								checked={field.value}
								size="small"
								icon={
									<Box
										sx={theme => ({
											width: theme.spacing(2.5),
											height: theme.spacing(2.5),
											border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
											borderRadius: 'inherit',
											'.MuiCheckbox-root:hover &': {
												borderColor: theme.palette.primary[700]
											}
										})}
									/>
								}
								checkedIcon={
									<Box
										sx={theme => ({
											width: theme.spacing(2.5),
											height: theme.spacing(2.5),
											border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
											borderRadius: 'inherit',
											backgroundColor: theme.palette.primary[700]
										})}
									/>
								}
								sx={{
									borderRadius: 0.5,
									padding: 0,
									'&:hover': {
										backgroundColor: 'transparent'
									}
								}}
								color="primary"
								onChange={(e, checked) => {
									field.onChange(e);
									onChange?.(checked);
								}}
							/>
						)}
					/>
				}
				label={<Paragraph2>{label}</Paragraph2>}
				labelPlacement="end"
			/>
		</FormGroup>
	);
};
