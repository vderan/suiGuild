import React, { useState } from 'react';
import MuiMenu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IMenuProps } from './Menu.types';
import Box from '@mui/material/Box/Box';
import { icons } from 'src/components/icons';
import { PreTitle } from 'src/components/Typography';

interface IMenu {
	detail: IMenuProps;
	onOpen?: () => void;
	onClose?: () => void;
}

export const Menu = ({
	detail,
	onOpen,
	onClose,
	anchorOrigin = {
		vertical: 'bottom',
		horizontal: 'left'
	},
	transformOrigin = {
		vertical: 'top',
		horizontal: 'left'
	},
	...rest
}: IMenu & Omit<MenuProps, 'open'>) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();

		setAnchorEl(e.currentTarget);
		onOpen?.();
	};

	const handleCloseMenu = (action?: () => void, component?: JSX.Element) => {
		if (component) {
			return;
		}

		setAnchorEl(null);

		if (action) {
			setTimeout(() => {
				action();
				onClose?.();
			}, 500);
		} else {
			onClose?.();
		}
	};

	return (
		<>
			{React.cloneElement(detail.label, { onClick: handleOpenMenu })}
			<MuiMenu
				{...rest}
				sx={{
					'& .MuiList-root': {
						padding: 0
					}
				}}
				id={`${detail.id}-menu`}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleCloseMenu()}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
				slotProps={{
					paper: {
						elevation: 0
					}
				}}
			>
				{detail.menus.map((menu, index) => {
					const IconComponent = icons[menu.icon as keyof typeof icons];

					return (
						<MenuItem
							key={index}
							onClick={() => handleCloseMenu(menu.action, menu.component)}
							disabled={menu.disabled}
							selected={menu.selected}
							disableRipple
							sx={{
								padding: theme => theme.spacing(1, 1.5),
								color: theme => theme.palette.text.primary,
								...(menu.isNeedDivider && {
									'&:last-child': {
										borderTop: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.default}`
									}
								})
							}}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									gap: theme => theme.spacing(8.75)
								}}
							>
								<PreTitle fontWeight={400}>{menu.label}</PreTitle>
								{menu.icon ? (
									<ListItemIcon>
										<IconComponent fontSize="small" />
									</ListItemIcon>
								) : menu.component ? (
									<>{menu.component}</>
								) : null}
							</Box>
						</MenuItem>
					);
				})}
			</MuiMenu>
		</>
	);
};

export default Menu;
