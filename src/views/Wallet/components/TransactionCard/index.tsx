import { Link, Stack } from '@mui/material';
import { Paragraph2 } from 'src/components/Typography';
import { ITransactionProps } from './TransactionCard.types';
import { formatAddress } from 'src/helpers/format.helpers';
import { DEFAULT_CHAIN } from 'src/constants/sui.constants';
import { Icon } from 'src/components/Icon';

export const TransactionCard = ({ address, type, price }: ITransactionProps) => {
	const isReceive = type === 'receive';

	return (
		<Stack
			component={Link}
			href={`https://suiexplorer.com/address/${address}?network=${DEFAULT_CHAIN.split(':')[1]}`}
			target="_blank"
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			sx={{
				padding: 1.5,
				gap: 2,
				backgroundColor: theme => theme.palette.dark[700],
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
							sx={{ color: theme => theme.palette.dark[900] }}
						/>
					}
				</Stack>
				<Paragraph2>{formatAddress(address)}</Paragraph2>
			</Stack>
			<Paragraph2>{price} SUI</Paragraph2>
		</Stack>
	);
};
