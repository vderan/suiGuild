import { Icons } from '../icons';

type Link = {
	title: string;
	href: string;
	icon: Icons;
};

export interface IShareBoxProps {
	secondary?: boolean;
	label?: string;
	isModal?: boolean;
	links?: Link[];
	element?: JSX.Element;
	size?: 'small' | 'medium' | 'large';
}
