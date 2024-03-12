import { NavLink } from 'react-router-dom';
import { Box, Link, Modal } from '@mui/material';
import { useWallets, useConnectWallet } from '@mysten/dapp-kit';
import { ButtonSmallText, H1Title, H2Title, Paragraph3, PreTitle } from 'src/components/Typography';
import homeImg from 'src/assets/images/home.png';
import homeMobileImg from 'src/assets/images/home-mobile.png';
import { SecondaryButton } from 'src/components/Button';
import { ILoginButtonProps } from './LoginModal.types';
import { IWalletProps, suiWallets } from 'src/constants/wallets.constants';
import { useDevice } from 'src/hooks/useDevice';

export const LoginModal = ({ open, onClose }: ILoginButtonProps) => {
	const wallets = useWallets();
	const { mutate: connect } = useConnectWallet();
	const { iMd } = useDevice();

	const handleConnect = (_wallet: IWalletProps) => {
		const wallet = wallets.find(w => w.name === _wallet.name);
		if (wallet) {
			connect({ wallet: wallet });
			onClose();
		} else {
			window.open(_wallet.downloadUrl, '_blank');
		}
	};

	const Title = iMd ? H2Title : H1Title;

	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={theme => ({
				backdropFilter: theme => `blur(${theme.spacing(1)})`,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				[theme.breakpoints.down('md')]: {
					alignItems: 'flex-end'
				}
			})}
		>
			<Box
				sx={theme => ({
					position: 'relative',
					display: 'flex',
					width: 'calc(100% - 32px)',
					maxWidth: '847px',
					margin: 2,
					maxHeight: '580px',
					height: 'calc(100% - 32px)',
					boxSizing: 'border-box',
					background: theme.palette.dark[700],
					border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
					borderRadius: 1.5,
					[theme.breakpoints.down('md')]: {
						flexDirection: 'column',
						maxHeight: '90%',
						height: 'auto'
					}
				})}
			>
				<Box
					sx={theme => ({
						width: '50%',
						background: theme.palette.gradient.secondary,
						borderTopLeftRadius: theme.spacing(1.5),
						borderBottomLeftRadius: theme.spacing(1.5),
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						gap: { xs: 0, md: 1.25 },
						[theme.breakpoints.down('md')]: {
							width: '100%',
							borderTopRightRadius: theme.spacing(1.5),
							borderBottomLeftRadius: 0
						}
					})}
				>
					<Box sx={theme => ({ padding: { xs: 3, md: theme.spacing(4, 7, 0, 4) } })}>
						<PreTitle textTransform="uppercase">Enter the Guild Hall!</PreTitle>
						<Title>Login with your account</Title>
					</Box>
					<Box
						sx={theme => ({
							height: '48%',
							overflow: 'hidden',
							paddingLeft: 4,
							[theme.breakpoints.down('md')]: {
								height: '111px',
								px: 2
							}
						})}
					>
						<Box
							component="img"
							sx={theme => ({
								minHeight: '273px',
								minWidth: '385px',
								width: 'auto',
								height: '100%',
								marginLeft: 'auto',
								display: 'block',
								[theme.breakpoints.down('md')]: {
									minHeight: '111px',
									maxWidth: '385px',
									margin: '0 auto',
									minWidth: 'initial',
									width: '100%'
								}
							})}
							src={iMd ? homeMobileImg : homeImg}
							alt="homeImage"
						/>
					</Box>
				</Box>
				<Box
					sx={theme => ({
						width: '50%',
						padding: { xs: theme.spacing(3, 2, 2), md: 4 },
						display: 'flex',
						flexDirection: 'column',
						gap: theme.spacing(3),
						[theme.breakpoints.down('md')]: {
							width: '100%',
							overflow: 'auto'
						}
					})}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<H2Title>Login</H2Title>
						<SecondaryButton size="small" startIcon="close" onClick={onClose} />
					</Box>
					<Box sx={{ display: 'flex', flexDirection: 'column', overflow: { xs: 'none', md: 'auto' }, width: '100%' }}>
						<Box
							sx={theme => ({
								display: 'flex',
								flexDirection: 'column',
								gap: theme.spacing(1),
								width: '100%'
							})}
						>
							{suiWallets.map(wallet => (
								<SecondaryButton key={wallet.name} onClick={() => handleConnect(wallet)}>
									Login with {wallet.name}
								</SecondaryButton>
							))}
						</Box>
					</Box>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Link component={NavLink} to="/terms" onClick={onClose} textAlign="center" lineHeight={1}>
							<ButtonSmallText color="text.secondary">Terms of Service</ButtonSmallText>
						</Link>
						<Link component={NavLink} to="/privacy" onClick={onClose} textAlign="center" lineHeight={1}>
							<ButtonSmallText color="text.secondary">Privacy Policy</ButtonSmallText>
						</Link>
						<Link component={NavLink} to="/conduct" onClick={onClose} textAlign="center" lineHeight={1}>
							<ButtonSmallText color="text.secondary">Code of conduct Gilder</ButtonSmallText>
						</Link>
					</Box>
					<Paragraph3 sx={{ opacity: 0.8 }} mx="auto" mt="auto">
						Gilder is a Norwegian word for Guild
					</Paragraph3>
				</Box>
			</Box>
		</Modal>
	);
};
