import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Skeleton, Stack } from '@mui/material';
import { SecondaryButton } from 'src/components/Button';
import { H1Title, H3Title, Label } from 'src/components/Typography';
import { AuthContext } from 'src/contexts';
import { Activity } from './components/Activity';
import { LoginModal } from 'src/components/Layout/Header/LoginModal';
import { useDevice } from 'src/hooks/useDevice';
import { useGilder } from 'src/hooks/useGilder';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { formatNumber } from 'src/helpers/number.helpers';
import { SUI_TOKEN_DECIMALS } from 'src/constants/constants';

export const Wallet = () => {
	const navigate = useNavigate();
	const { profile } = useContext(AuthContext);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const { iMid } = useDevice();
	const { getSuiBallance } = useGilder();

	const { data: ballance, isLoading: isBalanceLoading } = useCustomSWR(profile ? 'ballance' : null, getSuiBallance);

	const handleTransfer = (transfer: 'send' | 'receive') => {
		if (profile) {
			navigate(`/wallet/${transfer}/${profile?.id}`);
		} else {
			setIsLoginModalOpen(true);
		}
	};

	return (
		<Stack sx={{ pt: { xs: 3, lg: 5.625 }, gap: 3, maxWidth: '1064px', mx: 'auto' }}>
			<H3Title>Wallet</H3Title>
			<Stack gap={{ xs: 3, lg: 4 }}>
				<Stack
					gap={2}
					direction={{ xs: 'column', lg: 'row' }}
					alignItems={{ xs: 'flex-start', lg: 'center' }}
					justifyContent="space-between"
				>
					<Stack gap={0.5}>
						<Label>Balance</Label>
						{isBalanceLoading ? (
							<Skeleton variant="text" height={40} width={200} />
						) : (
							<H1Title>{formatNumber(ballance || 0, SUI_TOKEN_DECIMALS)} SUI</H1Title>
						)}
					</Stack>
					<Box sx={{ display: 'flex', gap: theme => theme.spacing(1), width: { xs: '100%', md: 'initial' } }}>
						<SecondaryButton
							endIcon="arrowUp"
							size="large"
							iconSize={iMid ? 'small' : 'large'}
							sx={{
								padding: { xs: 1, lg: 2 },
								justifyContent: 'space-between',
								minWidth: theme => ({ xs: 'initial', sm: theme.spacing(24.375) }),
								width: '100%'
							}}
							onClick={() => handleTransfer('send')}
						>
							Send
						</SecondaryButton>
						<SecondaryButton
							endIcon="arrowDown"
							size="large"
							iconSize={iMid ? 'small' : 'large'}
							sx={{
								padding: { xs: 1, lg: 2 },
								justifyContent: 'space-between',
								minWidth: theme => ({ xs: 'initial', sm: theme.spacing(24.375) }),
								width: '100%'
							}}
							onClick={() => handleTransfer('receive')}
						>
							Receive
						</SecondaryButton>
					</Box>
				</Stack>

				<Activity />
			</Stack>
			<LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
		</Stack>
	);
};
