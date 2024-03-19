import { Icons } from 'src/components/icons';

type Link = {
	title: string;
	href: string;
	icon: Icons;
};

export const NAVIGATION_LINKS = [
	{
		title: 'Home',
		icon: 'home',
		href: 'home'
	},
	{
		title: 'Communities',
		icon: 'community',
		href: 'forum#communities'
	},
	{
		title: 'Wallet',
		icon: 'wallet',
		href: 'wallet'
	}
] as Link[];
