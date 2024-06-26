import { Link, Stack } from '@mui/material';
import { Paragraph2 } from 'src/components/Typography';
import { ITransactionProps } from './TransactionCard.types';
import { formatAddress } from 'src/helpers/format.helpers';
import { Icon } from 'src/components/Icon';
import { SUI_CHAIN, SUI_EXPLORER_API } from 'src/constants/env.constants';

export const TransactionCard = ({ address, type, price }: ITransactionProps) => {
	const isReceive = type === 'receive';

	return (
		<Stack
			component={Link}
			href={`${SUI_EXPLORER_API}/address/${address}?network=${SUI_CHAIN}`}
			target="_blank"
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			sx={{
				padding: 1.5,
				gap: 2,
				backgroundColor: theme => theme.palette.surface.container,
				borderRadius: 1
			}}
		>
			<Stack direction="row" gap={1.5} alignItems="center">
				<Stack
					sx={{
						alignItems: 'center',
						justifyContent: 'center',
						width: theme => theme.spacing(4),
						height: theme => theme.spacing(4),
						borderRadius: '100%',
						backgroundColor: theme => (isReceive ? theme.palette.error.main : theme.palette.success.main)
					}}
				>
					{
						<Icon
							icon={isReceive ? 'arrowDownCircle' : 'arrowUpCircle'}
							fontSize="large"
							sx={{ color: theme => theme.palette.buttonText.white }}
						/>
					}
				</Stack>
				<Paragraph2>{formatAddress(address)}</Paragraph2>
			</Stack>
			<Paragraph2>{price} SUI</Paragraph2>
		</Stack>
	);
};
