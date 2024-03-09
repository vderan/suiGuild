import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const createUsernameSchema = z.object({
	username: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.regex(/^[a-z0-9_.]{3,30}$/, {
			message: 'Username may only use lowercase letters, numbers, ".", and "_"'
		})
});
