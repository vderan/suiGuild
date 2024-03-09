import { Link, Stack } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuButton } from 'src/components/Button';
import { Icons } from 'src/components/icons';

const menuList = [
	{
		title: 'Home',
		link: 'home'
	},
	{
		title: 'Communities',
		link: 'forum#communities'
	},
	{
		title: 'Wallet',
		link: 'wallet'
	}
];

const iconNames: Icons[] = ['home', 'community', 'wallet'];

export const MenuList = ({ isSideMenuOpen = true }: { isSideMenuOpen?: boolean }) => {
	const location = useLocation();
	const currentPath = location.pathname.split('/')[1];
	return (
		<Stack
			sx={{
				gap: 1,
				width: '100%'
			}}
		>
			{menuList?.map((item, index) => (
				<Link key={index} component={NavLink} to={item.link} sx={{ textDecoration: 'none' }}>
					<MenuButton startIcon={iconNames[index]} isFocused={currentPath === item.link.split('#')[0]}>
						{isSideMenuOpen && item.title}
					</MenuButton>
				</Link>
			))}
		</Stack>
	);
};
