import { Icons } from 'src/components/icons';

export interface IMenuProps {
	label: JSX.Element;
	id: string;
	menus: IMenu[];
}

export interface IMenu {
	label: string;
	icon?: Icons;
	action?: () => void;
	disabled?: boolean;
	selected?: boolean;
	isNeedDivider?: boolean;
	component?: JSX.Element;
}
