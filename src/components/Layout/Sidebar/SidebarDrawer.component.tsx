import { Box, Drawer, alpha } from '@mui/material';
import { IconButton } from 'src/components/IconButton';
import { useEffect, useState } from 'react';
import logoImg from 'src/assets/icons/logo-white.svg';
import { MenuList } from './Menulist';
import { SidebarCommunities } from './SidebarCommunities';
import { Stack } from '@mui/system';
import { useLocation } from 'react-router-dom';

export const SidebarDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if (isDrawerOpen) {
			setIsDrawerOpen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<>
			<IconButton size="large" icon="menu" onClick={() => setIsDrawerOpen(true)} />

			<Drawer
				anchor="left"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				sx={theme => ({
					'& .MuiDrawer-paper': {
						background: theme.palette.dark[700],
						padding: theme.spacing(2.5, 3),
						maxWidth: '297px',
						width: '100%',
						gap: 7.5
					},
					'& .MuiModal-backdrop': {
						backgroundColor: alpha(theme.palette.background.default, 0.3)
					}
				})}
			>
				<Stack sx={{ alignItems: 'center', gap: 3, flexDirection: 'row' }}>
					<IconButton icon="close" size="large" onClick={() => setIsDrawerOpen(false)} />
					<Box component="img" src={logoImg} width="132px" height="32px" />
				</Stack>
				<Stack gap={4}>
					<MenuList />
					<SidebarCommunities />
				</Stack>
			</Drawer>
		</>
	);
};
