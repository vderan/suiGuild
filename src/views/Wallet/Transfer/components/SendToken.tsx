import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Divider, FormHelperText, Grid, Skeleton, Stack, styled } from '@mui/material';
import { PrimaryButton } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Form } from 'src/components/Form';
import { InputField } from 'src/components/InputField';
import { H2Title, H3Title, H4Title, Paragraph1, Paragraph2 } from 'src/components/Typography';
import tokensuccess from 'src/assets/wallet/tokensuccess.png';
import tokenfailed from 'src/assets/wallet/tokenfailed.png';
import { useGilder } from 'src/hooks/useGilder';
import { api } from 'src/api';
import { formatAddress } from 'src/helpers/format.helpers';
import { IconButton } from 'src/components/IconButton';
import { sendTokenSchema } from 'src/schemas/send-token.schema';
import { formatNumber } from 'src/helpers/number.helpers';
import { MIST_PER_SUI, isValidSuiAddress } from '@mysten/sui.js/utils';
import { SUI_TOKEN_DECIMALS } from 'src/constants/constants';
import { useCustomSWR } from 'src/hooks/useCustomSWR';

interface ISendTokenProps {
	amount: string;
	receipent: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3),
	'& .balance-box': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2),
		'& .balance-div': {
			width: '100%',
			padding: theme.spacing(1.5, 2),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
			borderRadius: theme.spacing(1.5)
		},
		'& .available-div': {
			display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'center',
			gap: theme.spacing(1)
		}
	},
	'& .amount-box': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2),
		'& .amount-div': {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(1),
			[theme.breakpoints.down('md')]: {
				alignItems: 'flex-end'
			}
		}
	},
	'& .token-modal-box': {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.spacing(1)
	}
}));

// TODO: refactor

export const SendToken = () => {
	const { sendSuiToken, esimateSendSuiTokenGas } = useGilder();
	const [isResultModalOpen, setIsResultModalOpen] = useState(false);
	const [isUSDSelected, setIsUSDSelected] = useState(false);
	const [amount, setAmount] = useState(0);
	const [result, setResult] = useState('');
	const [receipent, setReceipent] = useState('');
	const [gasFee, setGasFee] = useState(0);
	const [gasEtimateFailedErrorMessage, setGasEtimateFailedErrorMessage] = useState('');
	const [isGasEtimateLoading, setIsGasEtimateLoading] = useState(false);
	const formRef = useRef<null | HTMLFormElement>(null);
	const { getSuiBallance } = useGilder();
	const { data: tokenPrice, isLoading: isTokenPriceLoading } = useCustomSWR('token_price', api.getTokenPrice);
	const { data: ballance, isLoading: isBalanceLoading } = useCustomSWR('ballance', getSuiBallance);
	const userBallance = useMemo(() => {
		if (!ballance) return 0;

		return ballance;
	}, [ballance]);

	const curPrice = useMemo(() => {
		if (!tokenPrice) return 0;

		return tokenPrice;
	}, [tokenPrice]);

	const calculatedAmount = useMemo(() => {
		if (isUSDSelected) {
			return amount / curPrice;
		} else {
			return amount;
		}
	}, [isUSDSelected, amount, curPrice]);

	const totalAmount = calculatedAmount + gasFee;

	useEffect(() => {
		const init = async () => {
			setGasEtimateFailedErrorMessage('');

			if (!amount || !isValidSuiAddress(receipent)) {
				setGasFee(0);
				return;
			}
			setIsGasEtimateLoading(true);
			try {
				const amount = (calculatedAmount * Number(MIST_PER_SUI)).toFixed();

				const gas = await esimateSendSuiTokenGas(amount, receipent);
				setGasFee(gas);
			} catch (e) {
				const err = e as Error;
				setGasEtimateFailedErrorMessage(err.message);
			}
			setIsGasEtimateLoading(false);
		};

		init();
	}, [calculatedAmount, receipent, esimateSendSuiTokenGas, amount]);

	const handleSubmit = async (data: ISendTokenProps) => {
		try {
			const amount = (calculatedAmount * Number(MIST_PER_SUI)).toFixed();
			await sendSuiToken(amount, data.receipent);
			setResult('success');
		} catch (e) {
			setResult('failed');
		}
		setIsResultModalOpen(true);
	};

	return (
		<StyledBox>
			<Box className="balance-box">
				<Form<ISendTokenProps>
					defaultValues={{
						amount: '',
						receipent: ''
					}}
					action={handleSubmit}
					myRef={formRef}
					schema={sendTokenSchema(totalAmount, userBallance)}
				>
					<Stack gap={1.5}>
						<Box className="balance-div">
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: theme => theme.spacing(1),
									overflow: 'hidden'
								}}
							>
								<InputField
									name="amount"
									placeholder="0.000"
									type="number"
									width="max-content"
									boxSx={{
										'& .MuiOutlinedInput-root': {
											padding: 0,
											minHeight: '31px'
										},
										'& .MuiOutlinedInput-input': {
											fontSize: '24px',
											height: '31px'
										},
										'& .MuiOutlinedInput-notchedOutline': {
											border: 'none'
										},
										'& .MuiFormHelperText-root': {
											marginLeft: '0!important'
										}
									}}
									maxAmount={
										isUSDSelected
											? formatNumber(userBallance * curPrice)
											: formatNumber(userBallance, SUI_TOKEN_DECIMALS, false)
									}
									minAmount="0"
									trailingDigits={SUI_TOKEN_DECIMALS}
									onChange={value => setAmount(Number(value))}
								/>
								<Paragraph2 color="text.secondary" noWrap>
									{isUSDSelected
										? `${formatNumber(amount / curPrice, SUI_TOKEN_DECIMALS)} SUI`
										: `≈$${formatNumber(amount * curPrice)}`}
								</Paragraph2>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									gap: 2,
									position: 'relative'
								}}
							>
								<IconButton icon="exchange" onClick={() => setIsUSDSelected(val => !val)} />
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: theme => theme.spacing(2)
									}}
								>
									<H3Title>{isUSDSelected ? 'USD' : 'SUI'}</H3Title>
									<Paragraph2 color="text.secondary">{isUSDSelected ? 'SUI' : 'USD'}</Paragraph2>
								</Box>
							</Box>
						</Box>
						<Box className="available-div">
							<Paragraph1 color="text.secondary">Available: </Paragraph1>
							{isTokenPriceLoading || isBalanceLoading ? (
								<>
									<Skeleton variant="text" height={20} width={50} />
									<Skeleton variant="text" height={20} width={50} />
								</>
							) : (
								<>
									<H4Title>{formatNumber(userBallance, SUI_TOKEN_DECIMALS)} SUI</H4Title>
									<Paragraph2 color="text.secondary">≈${formatNumber(userBallance * curPrice)}</Paragraph2>
								</>
							)}
						</Box>
					</Stack>

					<InputField name="receipent" placeholder="Enter receipent address" onChange={value => setReceipent(value)} />
				</Form>
			</Box>
			<Divider />
			<Grid container>
				<Grid item lg={12} md={12} sm={12} xs={12}>
					<Box className="amount-box">
						<Grid container spacing={2}>
							<Grid item lg={3} md={3} sm={6} xs={6}>
								<Paragraph1 color="text.secondary">Est.network fee:</Paragraph1>
							</Grid>
							<Grid item lg={9} md={9} sm={6} xs={6}>
								<Box className="amount-div">
									{isGasEtimateLoading ? (
										<>
											<Skeleton variant="text" height={20} width={100} />
											<Skeleton variant="text" height={20} width={100} />
										</>
									) : gasEtimateFailedErrorMessage ? (
										<FormHelperText sx={{ margin: '0!important' }} error>
											{gasEtimateFailedErrorMessage.includes('GasBalanceTooLow')
												? 'Not enough funds to calculate gas'
												: 'Failed to load fee'}
										</FormHelperText>
									) : (
										<>
											<H4Title noWrap>{formatNumber(gasFee, SUI_TOKEN_DECIMALS)} SUI</H4Title>
											<Paragraph2 noWrap color="text.secondary">
												≈${formatNumber(gasFee * curPrice)}
											</Paragraph2>
										</>
									)}
								</Box>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item lg={3} md={3} sm={6} xs={6}>
								<Paragraph1 color="text.secondary">Total amount:</Paragraph1>
							</Grid>
							<Grid item lg={9} md={9} sm={6} xs={6}>
								<Box className="amount-div">
									{isGasEtimateLoading ? (
										<>
											<Skeleton variant="text" height={20} width={100} />
											<Skeleton variant="text" height={20} width={100} />
										</>
									) : (
										<>
											<H4Title noWrap>{formatNumber(totalAmount, SUI_TOKEN_DECIMALS)} SUI</H4Title>
											<Paragraph2 color="text.secondary" noWrap>
												≈${formatNumber(totalAmount * curPrice)}
											</Paragraph2>
										</>
									)}
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
			<PrimaryButton
				disabled={isGasEtimateLoading || Boolean(gasEtimateFailedErrorMessage)}
				onClick={() => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
			>
				Send
			</PrimaryButton>
			<Dialog
				width="dialogMedium"
				open={isResultModalOpen}
				onClose={() => setIsResultModalOpen(false)}
				actions={
					<Stack justifyItems="center" width="100%">
						<PrimaryButton onClick={() => setIsResultModalOpen(false)} sx={{ margin: 'auto' }}>
							Back to Wallet
						</PrimaryButton>
					</Stack>
				}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 3
					}}
				>
					<Box
						sx={{
							width: theme => theme.spacing(12),
							height: theme => theme.spacing(12),
							padding: 2,
							borderRadius: 1,
							backgroundColor: theme => theme.palette.dark[500],
							border: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
						}}
					>
						<img width="100%" src={result === 'success' ? tokensuccess : tokenfailed} alt="Token Success" />
					</Box>
					<Stack gap={1.5}>
						<H2Title sx={{ textAlign: 'center' }}>
							Tokens sent {result === 'success' ? 'successfully' : 'unsuccessfully'}
						</H2Title>
						<Paragraph1 sx={{ textAlign: 'center' }}>
							{result === 'success'
								? `SUI has been sent to an address ${formatAddress(receipent)}`
								: 'Something went wrong. Please try again'}
						</Paragraph1>
					</Stack>
				</Box>
			</Dialog>
		</StyledBox>
	);
};
