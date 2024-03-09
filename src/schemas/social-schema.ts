import * as z from 'zod';

export const socialSchema = z.object({
	twitter: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/, { message: 'Invalid Twitter URL format' })
		.optional(),
	youtube: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?youtube\.com\/(@|c\/|user\/|channel\/)?([a-zA-Z0-9_-]{1,})/, {
			message: 'Invalid Youtube URL format'
		})
		.optional(),
	instagram: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/, {
			message: 'Invalid Instagram URL format'
		})
		.optional(),
	facebook: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?facebook.com\/(?:profile.php\?id=(?=\d.*))?([\w\\.-]+)+$/, {
			message: 'Invalid Facebook URL format'
		})
		.optional(),
	twitch: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?(twitch\.tv)\/([a-zA-Z0-9_]+)$/, { message: 'Invalid Twitch URL format' })
		.optional(),
	tiktok: z
		.string()
		.regex(/^$|^https?:\/\/(www\.)?(tiktok\.com)\/@([a-zA-Z0-9._-]+)$/, {
			message: 'Invalid Tiktok URL format'
		})
		.optional(),
	steam: z.string().optional(),
	discord: z.string().optional()
});
