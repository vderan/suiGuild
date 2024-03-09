import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const newGroupSchema = z.object({
	name: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
	avatar: z.string({
		required_error: FORM_ERRORS.required
	}),
	description: z.string().optional()
});
