import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

export const createCommunitySchema = z.object({
	profile: z.string().min(1, { message: 'Please select image' }),
	cover: z.string().min(1, { message: 'Please select image' }),
	name: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.max(30),
	description: z.string().refine(
		data => {
			const tmpData = data.replaceAll('&nbsp;', '').replaceAll(/\s+/g, '');
			const isVaild = tmpData == '<p><br></p>' || tmpData === '<p></p>';
			return !isVaild;
		},
		{ message: 'Please insert anything on editor' }
	)
});

export const editCommunitySchema = z.object({
	profile: z.string().min(1, { message: 'Please select image' }),
	cover: z.string().min(1, { message: 'Please select image' }),
	name: z
		.string()
		.min(3, { message: FORM_ERRORS.minChars(3) })
		.max(30)
});
