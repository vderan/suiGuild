import * as z from 'zod';
import { FORM_ERRORS } from 'src/constants/form-errors.constants';

export const resourceSchema = z.object({
	resources: z.array(
		z.object({
			title: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
			url: z
				.string()
				.regex(/^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/, {
					message: 'Invalid URL format'
				})
		})
	)
});
