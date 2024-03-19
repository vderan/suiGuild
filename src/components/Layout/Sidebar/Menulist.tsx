import { Link, Stack } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuButton } from 'src/components/Button';
import { NAVIGATION_LINKS } from 'src/constants';

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
			{NAVIGATION_LINKS.map((item, index) => (
				<Link key={index} component={NavLink} to={item.href} sx={{ textDecoration: 'none' }}>
					<MenuButton startIcon={item.icon} isFocused={currentPath === item.href.split('#')[0]}>
						{isSideMenuOpen && item.title}
					</MenuButton>
				</Link>
			))}
		</Stack>
	);
};
