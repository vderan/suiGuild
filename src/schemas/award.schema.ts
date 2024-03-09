import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const awardFormSchema = z.object({
	title: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
	year: z
		.string({
			required_error: 'Select a year'
		})
		.min(1, 'Select a year'),
	month: z.string(),
	link: z.string().url({ message: FORM_ERRORS.url }),
	cover: z.string().min(1, { message: 'Please select image' })
});
