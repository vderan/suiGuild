import { ButtonBase, Link, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MediumAvatar, SmallAvatar } from 'src/components/Avatar';
import { Icon } from 'src/components/Icon';
import { IMenuProps, Menu } from 'src/components/Menu';
import { SwitchField } from 'src/components/Switch';
import { ButtonMediumText } from 'src/components/Typography';
import { Icons } from 'src/components/icons';
import { avatarUrl } from 'src/constants/images.constants';
import { AuthContext, ColorModeContext } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';

type Link = {
	title: string;
	href: string;
	icon: Icons;
};

export const BottomNavigationBar = () => {
	const { profile, signOut, isLoggedIn } = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();
	const { isDarkMode, toggleColorMode } = useContext(ColorModeContext);
	const [isProfileSelected, setIsProfileSelected] = useState(false);
	const Avatar = isProfileSelected ? SmallAvatar : MediumAvatar;
	const menuData: IMenuProps = {
		label: (
			<ButtonBase
				sx={theme => ({
					display: 'flex',
					alignItems: 'center',
					gap: 0.625,
					padding: isProfileSelected ? theme.spacing(1, 2, 1, 1.5) : 1,
					borderRadius: 1,
					background: isProfileSelected ? theme.palette.gradient.secondary : 'transparent'
				})}
			>
				<Avatar image={ipfsUrl(profile?.avatar || avatarUrl)} />
				{isProfileSelected && (
					<ButtonMediumText
						sx={{ overflow: 'hidden', textOverflow: 'ellipsis', color: theme => theme.palette.buttonText.white }}
					>
						Profile
					</ButtonMediumText>
				)}
			</ButtonBase>
		),
		id: 'appMenu',
		menus: [
			...(profile?.displayName
				? [
						{
							label: 'Profile',
							action: () => navigate(`/profile/${profile?.id}`)
						}
				  ]
				: []),
			{
				label: 'Account settings',
				action: () => navigate(`/setting/${profile?.id}/account`)
			},
			{
				label: 'Dark mode',
				component: <SwitchField title="switch" checked={isDarkMode} onChange={toggleColorMode} />
			},
			{
				isNeedDivider: true,
				label: 'Log out',
				action: signOut
			}
		]
	};

	const links = [
		{
			title: 'Home',
			icon: 'home',
			href: '/home'
		},
		{
			title: 'Communities',
			icon: 'feed',
			href: '/forum'
		},
		{
			title: 'Wallet',
			icon: 'wallet',
			href: '/wallet'
		}
	] as Link[];
	return (
		<Paper
			elevation={0}
			sx={theme => ({
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1400,
				borderRadius: 0,
				background: theme.palette.surface.background,
				borderTop: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
				backdropFilter: `blur(${theme.spacing(1)})`
			})}
		>
			<Box component="nav" sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				{links.map((item, index) => {
					const isActive = item.href === location.pathname && !isProfileSelected;
					return (
						<Link
							key={index}
							component={NavLink}
							to={item.href}
							sx={theme => ({
								display: 'flex',
								alignItems: 'center',
								gap: 0.625,
								padding: isActive ? theme.spacing(1, 2, 1, 1.5) : 1,
								borderRadius: 1,
								background: isActive ? theme.palette.gradient.secondary : 'transparent'
							})}
						>
							<Icon
								icon={item.icon}
								fontSize="small"
								sx={{
									opacity: isActive ? 1 : 0.5,
									color: isActive ? theme => theme.palette.system.default : theme => theme.palette.text.secondary
								}}
							/>

							{isActive && (
								<ButtonMediumText
									sx={{ overflow: 'hidden', textOverflow: 'ellipsis', color: theme => theme.palette.buttonText.white }}
								>
									{item.title}
								</ButtonMediumText>
							)}
						</Link>
					);
				})}
				{isLoggedIn && (
					<Menu
						onOpen={() => setIsProfileSelected(true)}
						onClose={() => setIsProfileSelected(false)}
						detail={menuData}
						anchorOrigin={{
							vertical: -29,
							horizontal: 99
						}}
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'right'
						}}
					/>
				)}
			</Box>
		</Paper>
	);
};
