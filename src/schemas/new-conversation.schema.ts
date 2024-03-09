import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const newConversationSchema = z.object({
	member: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.regex(/^[a-z0-9_.]{3,30}$/, {
			message: 'Username may only use lowercase letters, numbers, ".", and "_"'
		})
		.optional()
		.or(z.literal('')),
	members: z.array(z.string()).nonempty({ message: 'Select members from a friend list or "Type username(s)" field' })
});
