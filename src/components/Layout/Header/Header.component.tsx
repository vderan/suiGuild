import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Link } from '@mui/material';
import { useDevice } from 'src/hooks/useDevice';
import { IconButton } from 'src/components/IconButton';
import { IMenuProps, Menu } from 'src/components/Menu';
import { NotificationPopup } from 'src/components/NotificationPopup';
import { Label } from 'src/components/Typography';
import { AuthContext, ChatContext, ColorModeContext, NotificationContext } from 'src/contexts';
import { HeaderAvatar } from 'src/components/Avatar';
import { SwitchField } from 'src/components/Switch';
import { AlertBadge } from 'src/components/Badge';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { formatAddress } from 'src/helpers/format.helpers';
import logoImg from 'src/assets/icons/logo.svg';
import { toast } from 'react-toastify';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { LoginModal } from './LoginModal';
import { Icon } from 'src/components/Icon';
import { GroupChats } from 'src/views/Forum/components/Chat/GroupChats';
import { ChatCard } from 'src/views/Forum/components/Chat/ChatCard/ChatCard';
import { GroupInfoCard } from 'src/views/Forum/components/Chat/GroupInfoCard/GroupInfoCard';
import { NewConversation } from 'src/views/Forum/components/Chat/ChatCard/NewConversation';
import { NavLink } from 'react-router-dom';
import { CreateCommunityModal } from 'src/components/Community';
import { useSetRecoilState } from 'recoil';
import { isSideMenuOpenedState } from 'src/recoil/sideMenu';
import { SidebarDrawer } from '../Sidebar';

export interface ICreateCommunityProps {
	avatar: string;
	cover: string;
	title: string;
	description: string;
	rules: string;
	links: string;
	resources: string;
}

export const Header = ({ isSidebarAlwaysClosed = false }: { isSidebarAlwaysClosed?: boolean }) => {
	const { activeJid, chatOpen, setChatOpen, infoOpen, conversationOpen, setConversationOpen, conversationCreating } =
		useContext(ChatContext);
	const { profile, signOut, jid } = useContext(AuthContext);
	const { notifications } = useContext(NotificationContext);
	const account = useCurrentAccount();
	const navigate = useNavigate();
	const { iMid, isSidebarFullShown } = useDevice();
	const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const isChatPage = window.location.pathname === '/chat';
	const { isDarkMode, toggleColorMode } = useContext(ColorModeContext);
	const setIsSideMenuOpenedState = useSetRecoilState(isSideMenuOpenedState);

	const menuData: IMenuProps = {
		label: iMid ? (
			<Icon icon="menu" sx={{ cursor: 'pointer' }} />
		) : (
			<Box
				sx={theme => ({
					display: 'flex',
					alignItems: 'center',
					cursor: 'pointer',
					gap: theme.spacing(1),
					[theme.breakpoints.down('sm')]: {
						gap: 0.25
					}
				})}
			>
				<HeaderAvatar image={ipfsUrl(profile?.avatar ?? avatarUrl)} />
				<Label> {formatAddress(account?.address || '')}</Label>
				<IconButton icon="chevronDown" size="large" />
			</Box>
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

	const createMenu: IMenuProps = {
		label: (
			<SecondaryButton size="small" startIcon="add">
				Create
			</SecondaryButton>
		),
		id: 'createCommuityAndPost',
		menus: [
			{
				label: 'Community',
				action: () => {
					if (!profile?.displayName) {
						toast.warning('You should have your own display name!', { theme: 'colored' });
						navigate(`/setting/${account?.address}/eprofile`);
					} else {
						setIsCreateCommunityModalOpen(true);
					}
				}
			},
			{
				label: 'Post',
				action: () => {
					if (!profile?.displayName) {
						toast.warning('You should have your own display name!', { theme: 'colored' });
						navigate(`/setting/${account?.address}/eprofile`);
					} else {
						navigate('/createpost');
					}
				}
			}
		]
	};

	return (
		<>
			<Box sx={{ minHeight: theme => theme.spacing(9) }}>
				<AppBar
					sx={theme => ({
						position: 'fixed',
						top: 0,
						width: '100%',
						maxHeight: theme.spacing(9),
						background: 'transparent',
						borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
						backdropFilter: `blur(${theme.spacing(0.5)})`,
						[theme.breakpoints.down('lg')]: {
							maxHeight: 'initial'
						}
					})}
				>
					<Toolbar sx={{ minHeight: theme => `${theme.spacing(8.875)}!important` }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
								{!iMid &&
									(isSidebarAlwaysClosed || !isSidebarFullShown ? (
										<SidebarDrawer />
									) : (
										<IconButton size="large" icon="menu" onClick={() => setIsSideMenuOpenedState(prev => !prev)} />
									))}

								<Link component={NavLink} sx={{ display: 'flex', alignItems: 'center' }} to="/home">
									<img src={logoImg} alt="logoImg" width={iMid ? 95 : 125} height={iMid ? 23 : 32} />
								</Link>
							</Box>
							{profile ? (
								<Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: theme => theme.spacing(2.25) }}>
										<Menu detail={createMenu} />
										<AlertBadge badgeContent={notifications.length.toString()}>
											<NotificationPopup />
										</AlertBadge>
										{profile?.displayName && (
											<IconButton
												loading={!jid}
												icon="message"
												size="small"
												onClick={() => {
													if (!jid && Boolean(profile?.displayName)) {
														return;
													}

													if (!profile?.displayName) {
														toast.warning('You should have your own display name!', { theme: 'colored' });
														navigate(`/setting/${account?.address}/eprofile`);
													} else {
														setChatOpen(false);
														setConversationOpen(false);
														navigate('/chat');
													}
												}}
											/>
										)}
										{!iMid && <Menu detail={menuData} />}
									</Box>
								</Box>
							) : (
								<PrimaryButton
									size="small"
									sx={{
										minWidth: 99
									}}
									onClick={() => setOpenModal(true)}
								>
									Log In
								</PrimaryButton>
							)}
						</Box>
					</Toolbar>
				</AppBar>
				<CreateCommunityModal
					isOpen={isCreateCommunityModalOpen}
					onClose={() => setIsCreateCommunityModalOpen(false)}
				/>
			</Box>
			{profile?.displayName && !isChatPage && !iMid && (
				<Box
					sx={{
						position: 'fixed',
						width: theme => theme.spacing(34),
						bottom: theme => theme.spacing(3),
						right: theme => theme.spacing(3),
						zIndex: 9
					}}
				>
					<PrimaryButton
						startIcon="message"
						flexoption="start"
						loading={!jid}
						onClick={() => {
							if (!jid && Boolean(profile?.displayName)) {
								return;
							}

							if (!profile?.displayName) {
								toast.warning('You should have your own display name!', { theme: 'colored' });
								navigate(`/setting/${account?.address}/eprofile`);
							} else {
								setChatOpen(true);
							}
						}}
						sx={{ display: chatOpen ? 'none' : 'flex', width: '100%' }}
					>
						Chat
					</PrimaryButton>
					<Box
						sx={{
							display: chatOpen && !activeJid && !conversationOpen ? 'flex' : 'none',
							flexDirection: 'column',
							gap: 1
						}}
					>
						<GroupChats />
						<PrimaryButton onClick={() => setConversationOpen(true)}>New conversation</PrimaryButton>
					</Box>
					<Box
						sx={{
							display: chatOpen && activeJid && !infoOpen ? 'flex' : 'none',
							flexDirection: 'column',
							gap: 1
						}}
					>
						<ChatCard />
					</Box>
					<Box
						sx={{
							display: chatOpen && activeJid && infoOpen ? 'flex' : 'none',
							flexDirection: 'column',
							gap: 1
						}}
					>
						<GroupInfoCard />
					</Box>
					<Box
						sx={{
							display: chatOpen && !activeJid && conversationOpen ? 'flex' : 'none',
							flexDirection: 'column',
							gap: 1
						}}
					>
						<NewConversation isCreating={isCreating} setIsCreating={() => setIsCreating(!isCreating)} />
						<Box sx={{ display: 'flex', gap: 1 }}>
							<PrimaryButton onClick={() => setIsCreating(true)} loading={conversationCreating}>
								Create
							</PrimaryButton>
							<SecondaryButton onClick={() => setConversationOpen(false)}>Cancel</SecondaryButton>
						</Box>
					</Box>
				</Box>
			)}
			<LoginModal open={openModal} onClose={() => setOpenModal(false)} />
		</>
	);
};
