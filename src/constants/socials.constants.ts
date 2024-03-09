import { Icons } from 'src/components/icons';

export interface ICommunitySocial {
	id: string;
	icon: Icons;
	label: string;
	url: string;
}

export const communitySocials: ICommunitySocial[] = [
	{
		id: 'twitter',
		icon: 'twitter',
		label: 'X',
		url: 'https://twitter.com'
	},
	{
		id: 'discord',
		icon: 'discordSmall',
		label: 'Discord',
		url: 'https://discord.gg'
	},
	{
		id: 'tiktok',
		icon: 'tiktok',
		label: 'TikTok',
		url: 'https://tiktok.com'
	},
	{
		id: 'twitch',
		icon: 'twitch',
		label: 'Twitch',
		url: 'https://twitch.tv'
	},
	{
		id: 'medium',
		icon: 'medium',
		label: 'Medium',
		url: 'https://medium.com'
	},
	{
		id: 'youtube',
		icon: 'youtube',
		label: 'Youtube',
		url: 'https://youtube.com'
	},
	{
		id: 'telegram',
		icon: 'telegram',
		label: 'Telegram',
		url: 'https://t.me'
	},
	{
		id: 'instagram',
		icon: 'instagram',
		label: 'Instagram',
		url: 'https://instagram.com'
	},
	{
		id: 'opensea',
		icon: 'opensea',
		label: 'Opensea',
		url: 'https://opensea.io'
	},
	{
		id: 'github',
		icon: 'github',
		label: 'GitHub',
		url: 'https://github.com'
	}
];

export interface ISocial {
	id: string;
	icon: Icons;
	label: string;
	url: string;
}

export const socials: ISocial[] = [
	{
		id: 'twitter',
		icon: 'twitter',
		label: 'X',
		url: 'https://twitter.com'
	},
	{
		id: 'youtube',
		icon: 'youtube',
		label: 'Youtube',
		url: 'https://www.youtube.com'
	},
	{
		id: 'twitch',
		icon: 'twitch',
		label: 'Twitch',
		url: 'https://www.twitch.com'
	},
	{
		id: 'tiktok',
		icon: 'tiktok',
		label: 'TikTok',
		url: 'https://www.tiktok.com'
	},
	{
		id: 'instagram',
		icon: 'instagram',
		label: 'Instagram',
		url: 'https://www.instagram.com'
	},
	{
		id: 'facebook',
		icon: 'facebook',
		label: 'Facebook',
		url: 'https://www.facebook.com'
	},
	{
		id: 'steam',
		icon: 'steam',
		label: 'Steam',
		url: 'https://store.steampowered.com'
	},
	{
		id: 'discord',
		icon: 'discord',
		label: 'Discord',
		url: 'https://discord.com'
	}
];
