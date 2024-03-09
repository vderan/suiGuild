import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ButtonBase, Divider, Stack } from '@mui/material';
import QRCode from 'qrcode.react';
import { ButtonSmallText, H3Title, Paragraph2 } from 'src/components/Typography';
import { StandaloneInputField } from 'src/components/InputField';
import { IconButton } from 'src/components/IconButton';
import { useClipboard } from 'src/hooks/useClipboard';
import { Icon } from 'src/components/Icon';
import { ColorModeContext } from 'src/contexts';
import { useContext } from 'react';

export const Receive = () => {
	const navigate = useNavigate();
	const account = useCurrentAccount();
	const { copy } = useClipboard();
	const accountAddress = account?.address || '';
	const { theme } = useContext(ColorModeContext);

	return (
		<Stack sx={{ pt: { xs: 3, lg: 5 }, gap: 4, maxWidth: '560px', mx: 'auto' }}>
			<ButtonBase sx={{ gap: 0.5, width: 'max-content' }} onClick={() => navigate(-1)}>
				<Icon icon="chevronLeft" sx={{ color: theme => theme.palette.text.secondary }} />
				<ButtonSmallText color="text.secondary">Go back</ButtonSmallText>
			</ButtonBase>
			<Stack gap={3}>
				<H3Title>Receive</H3Title>
				<Stack gap={3} alignItems="center">
					<QRCode
						value={accountAddress}
						size={317}
						level="L"
						includeMargin
						style={{ borderRadius: theme.spacing(1) }}
						bgColor={theme.palette.dark[500]}
						fgColor={theme.palette.text.primary}
					/>
					<Divider sx={{ width: '100%', borderColor: theme => theme.palette.border.subtle }} />
					<Stack gap={1} width="100%">
						<H3Title>Your SUI address</H3Title>
						<Paragraph2 color="text.secondary">This address can only be used to receive compatible tokens</Paragraph2>
					</Stack>
					<StandaloneInputField
						name="address"
						value={accountAddress}
						readOnly
						endElement={<IconButton icon="copy" onClick={() => copy(accountAddress)} />}
					/>
				</Stack>
			</Stack>
		</Stack>
	);
};
