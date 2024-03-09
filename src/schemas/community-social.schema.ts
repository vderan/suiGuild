import * as z from 'zod';

export const communityAboutSchema = z.object({
	description: z.string().refine(
		data => {
			const tmpData = data.replaceAll('&nbsp;', '').replaceAll(/\s+/g, '');
			const isVaild = tmpData == '<p><br></p>' || tmpData === '<p></p>';
			return !isVaild;
		},
		{ message: 'Please insert anything on editor' }
	),
	links: z.object({
		twitter: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/, { message: 'Invalid Twitter URL format' })
			.optional(),
		discord: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/, {
				message: 'Invalid Discord URL format'
			})
			.optional(),
		tiktok: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(tiktok\.com)\/@([a-zA-Z0-9._-]+)$/, {
				message: 'Invalid Tiktok URL format'
			})
			.optional(),
		twitch: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(twitch\.tv)\/([a-zA-Z0-9_]+)$/, { message: 'Invalid Twitch URL format' })
			.optional(),
		medium: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(medium\.com)\/@([A-z0-9._]+)$/, {
				message: 'Invalid Medium URL format'
			})
			.optional(),
		youtube: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?youtube\.com\/(@|c\/|user\/|channel\/)?([a-zA-Z0-9_-]{1,})/, {
				message: 'Invalid Youtube URL format'
			})
			.optional(),
		telegram: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(t\.me|telegram\.me)\/([a-zA-Z0-9_]+)$/, {
				message: 'Invalid Telegram URL format'
			})
			.optional(),
		instagram: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/, {
				message: 'Invalid Instagram URL format'
			})
			.optional(),
		opensea: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?(opensea\.io)\/(assets\/\w+|account\/\w+)$/, {
				message: 'Invalid Opensea URL format'
			})
			.optional(),
		github: z
			.string()
			.regex(/^$|^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_]{1,39}$/gim, { message: 'Invalid GitHub URL format' })
			.optional()
	})
});
