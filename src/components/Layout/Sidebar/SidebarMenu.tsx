import { Stack } from '@mui/material';
import { MenuList } from './Menulist';
import { useDevice } from 'src/hooks/useDevice';
import { useRecoilValue } from 'recoil';
import { isSideMenuOpenedState } from 'src/recoil/sideMenu';
import { SidebarCommunities } from './SidebarCommunities';
import { ColorModeContext } from 'src/contexts';
import { useContext } from 'react';

export const SidebarMenu = ({ isSidebarAlwaysClosed = false }: { isSidebarAlwaysClosed?: boolean }) => {
	const { isSidebarFullShown } = useDevice();
	const { isDarkMode } = useContext(ColorModeContext);

	const isSideMenuOpened = useRecoilValue(isSideMenuOpenedState);

	const isMenuOpened = isSideMenuOpened && !isSidebarAlwaysClosed && isSidebarFullShown;

	return (
		<Stack
			sx={theme => ({
				padding: theme.spacing(5, 3, 3, 3),
				width: isMenuOpened ? '300px' : '84px',
				transition: 'width 0.2s ease',
				overflowY: 'auto',
				maxHeight: theme => `calc(100vh - ${theme.spacing(9)})`,
				borderRight: `${theme.spacing(0.125)} solid`,
				borderColor: isMenuOpened && isDarkMode ? 'transparent' : theme.palette.border.subtle,
				background: theme => (isDarkMode ? 'transparent' : theme.palette.surface.container),
				gap: 4
			})}
		>
			<MenuList isSideMenuOpen={isMenuOpened} />
			<SidebarCommunities isFullSize={isMenuOpened} />
		</Stack>
	);
};
