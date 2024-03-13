import { Box } from '@mui/material';
import { useState } from 'react';
import wellcomeImg from 'src/assets/images/wellcome.png';
import { TertiaryButton } from 'src/components/Button';
import { LoginModal } from 'src/components/Layout/Header/LoginModal';
import { H1Title, Paragraph2 } from 'src/components/Typography';
import { useDevice } from 'src/hooks/useDevice';

export const WelcomeBanner = () => {
	const { iMd } = useDevice();
	const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);

	return (
		<>
			<Box
				sx={theme => ({
					display: 'flex',
					position: 'relative',
					background: theme.palette.gradient.secondary,
					borderRadius: theme.spacing(1.5),
					[theme.breakpoints.down('md')]: {
						overflow: 'hidden'
					}
				})}
			>
				<Box
					sx={theme => ({
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						padding: theme.spacing(3.5, 3.5, 4),
						zIndex: 1,
						maxWidth: '374px',
						width: '100%',
						[theme.breakpoints.down('md')]: {
							maxWidth: 'initial',
							padding: theme.spacing(3, 3, 21.875)
						}
					})}
				>
					<H1Title color={theme => theme.palette.buttonText.white}> Enter the Realm of Web3 Gaming</H1Title>
					<Paragraph2 color={theme => theme.palette.buttonText.white} lineHeight="20px">
						Welcome to Gilder, where the future of gaming meets limitless possibilities.
					</Paragraph2>
					<TertiaryButton size={iMd ? 'large' : 'medium'} sx={{ mt: 2 }} onClick={() => setIsLoginModalOpened(true)}>
						Connect wallet
					</TertiaryButton>
				</Box>
				<Box
					sx={theme => ({
						display: 'flex',
						justifyContent: 'center',
						overflow: 'hidden',
						width: '383px',
						height: '269px',
						position: 'absolute',
						bottom: 0,
						right: 0,
						[theme.breakpoints.down('md')]: {
							bottom: theme.spacing(-6.875),
							right: theme.spacing(-3)
						}
					})}
				>
					<img src={wellcomeImg} alt="wellcome image" />
				</Box>
			</Box>
			<LoginModal open={isLoginModalOpened} onClose={() => setIsLoginModalOpened(false)} />
		</>
	);
};
