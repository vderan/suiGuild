import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const createCommentSchema = z.object({
	comment: z.string().min(3, { message: FORM_ERRORS.minChars(3) })
});
