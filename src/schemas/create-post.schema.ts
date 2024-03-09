import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const createPostSchema = z.object({
	title: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
	content: z.string().refine(
		data => {
			const tmpData = data.replaceAll('&nbsp;', '').replaceAll(/\s+/g, '');
			const isVaild = tmpData == '<p><br></p>' || tmpData === '<p></p>';
			return !isVaild;
		},
		{ message: 'Please insert anything on editor' }
	),
	notify: z.boolean()
});
