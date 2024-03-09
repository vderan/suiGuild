import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const editProfileSchema = z.object({
	avatar: z.string(),
	cover: z.string(),
	name: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.max(30, { message: FORM_ERRORS.maxChars(30) })
		.or(z.literal('')),
	bio: z.string(),
	country: z.string().nullable(),
	language: z.string().nullable(),
	website: z.string()
});

export const editAccountSchema = z.object({
	email: z.string().email({ message: FORM_ERRORS.email }).optional().or(z.literal('')),
	username: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.regex(/^[a-z0-9_.]{3,30}$/, {
			message: 'Username may only use lowercase letters, numbers, ".", and "_"'
		})
});
