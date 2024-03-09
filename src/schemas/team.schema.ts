import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const teamFormSchema = z
	.object({
		name: z
			.string()
			.min(3, { message: FORM_ERRORS.minChars(3) })
			.max(20),
		startYear: z
			.string({
				required_error: 'Select a year'
			})
			.min(1, 'Select a year'),
		startMonth: z
			.string({
				required_error: 'Select a month'
			})
			.min(1, 'Select a month'),
		isCurrentlyPlaying: z.boolean(),
		endYear: z.string(),
		endMonth: z.string(),
		logo: z.string().min(1, { message: 'Please select image' })
	})
	.refine(data => (data.isCurrentlyPlaying ? true : !data.isCurrentlyPlaying && !!data.endYear), {
		message: 'Select a year',
		path: ['endYear']
	})
	.refine(data => (data.isCurrentlyPlaying ? true : !data.isCurrentlyPlaying && !!data.endMonth), {
		message: 'Select a month',
		path: ['endMonth']
	})
	.refine(data => (data.isCurrentlyPlaying ? true : Number(data.endYear) >= Number(data.startYear)), {
		message: 'This year must be greater than or equal to the start year',
		path: ['endYear']
	})
	.refine(
		data => (Number(data.endYear) === Number(data.startYear) ? Number(data.endMonth) >= Number(data.startMonth) : true),
		{
			message: 'This year must be greater than or equal to the start month',
			path: ['endMonth']
		}
	);
