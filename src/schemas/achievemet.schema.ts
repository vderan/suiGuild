import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const achievementFormSchema = z.object({
	title: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.max(20),
	year: z
		.string({
			required_error: 'Select a year'
		})
		.min(1, 'Select a year'),
	month: z
		.string({
			required_error: 'Select a month'
		})
		.min(1, 'Select a month'),
	place: z
		.string({
			required_error: 'Select a place'
		})
		.min(1, 'Select a place'),
	cover: z.string().min(1, { message: 'Please select image' }),
	link: z.string().url({ message: FORM_ERRORS.url })
});
