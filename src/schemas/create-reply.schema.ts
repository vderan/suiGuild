import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const createReplySchema = z.object({
	reply: z.string().min(3, { message: FORM_ERRORS.minChars(3) })
});
