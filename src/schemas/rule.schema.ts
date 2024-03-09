import * as z from 'zod';
import { FORM_ERRORS } from 'src/constants/form-errors.constants';

export const ruleSchema = z.object({
	rules: z.array(
		z.object({
			title: z
				.string()
				.min(3, { message: FORM_ERRORS.minChars(3) })
				.max(100),
			content: z
				.string()
				.min(3, { message: FORM_ERRORS.minChars(3) })
				.max(200)
		})
	)
});
