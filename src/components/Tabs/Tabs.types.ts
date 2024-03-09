import { Icons } from 'src/components/icons';

export interface ICustomTabsProps {
	tabs: ITabs[];
	isTertiary?: boolean;
	tabsChildren?: React.ReactNode;
}

export interface ITabs {
	label: string;
	countNum?: string;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	endImage?: string;
	children?: React.ReactNode;
	isActive?: boolean;
	hash?: string;
}
