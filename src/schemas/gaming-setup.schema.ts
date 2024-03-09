import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const gamingSetupFormSchema = z.object({
	name: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
	component: z
		.string({
			required_error: 'Select a component'
		})
		.min(1, 'Select a component'),
	community: z
		.string({
			required_error: 'Select a community'
		})
		.min(1, 'Select a community'),
	image: z.string().min(1, { message: 'Please select image' })
});
