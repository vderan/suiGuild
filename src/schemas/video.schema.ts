import { FORM_ERRORS } from 'src/constants/form-errors.constants';
import * as z from 'zod';

const tiktok = z.string().regex(/^$|^https?:\/\/(www\.)?tiktok\.com\//, { message: 'Provide a valid link' });
const instagram = z.string().regex(/^$|^https?:\/\/(www\.)?instagram\.com\//);
const twitch = z.string().regex(/^$|^https?:\/\/(www\.)?twitch\.tv\//);
const youtube = z.string().regex(/^$|^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//);

export const videoFormSchema = z.object({
	name: z.string().min(3, { message: FORM_ERRORS.minChars(3) }),
	link: z.union([tiktok, instagram, twitch, youtube])
});
