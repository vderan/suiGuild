import { useContext, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import useSWR from 'swr';
import { StandaloneInputField } from 'src/components/InputField';
import { TransactionCard } from './TransactionCard';
import { Label } from 'src/components/Typography';
import { formatDate } from 'src/helpers/date.helpers';
import { useGilder } from 'src/hooks/useGilder';
import { TransactionCardSkeleton } from 'src/components/Skeleton/TransactionCardSkeleton';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { MoveCallSuiTransaction } from '@mysten/sui.js/client';
import { formatNumber } from 'src/helpers/number.helpers';
import { SUI_TOKEN_DECIMALS } from 'src/constants/constants';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';
import { NotFound } from 'src/components/NotFound';
import { AuthContext } from 'src/contexts';

interface IOwner {
	AddressOwner: string;
}

interface ITransaction {
	inputs: {
		type: 'pure';
		value: string;
		valueType?: string | null;
	}[];
	kind: 'ProgrammableTransaction';
	transactions: {
		MoveCall: MoveCallSuiTransaction;
	}[];
}

export const Activity = () => {
	const { profile } = useContext(AuthContext);

	const { getTransactions } = useGilder();
	const { data: transactions, isLoading, error: isError } = useSWR(profile ? 'getTransactions' : null, getTransactions);
	const [search, setSearch] = useState('');

	const filteredTransactions = useMemo(() => {
		if (!transactions?.length) return [];

		const transferedTransactions = transactions.filter(txn => {
			return (
				(txn.transaction?.data.transaction as ITransaction)?.transactions?.[1]?.MoveCall?.function === 'transferSui' &&
				txn.effects?.status.status === 'success'
			);
		});
		return transferedTransactions.filter(txn => {
			return txn.balanceChanges?.some(i => (i.owner as IOwner).AddressOwner.includes(search));
		});
	}, [transactions, search]);
	return (
		<Stack gap={2}>
			<StandaloneInputField
				name="search"
				value={search}
				placeholder="Search"
				startIcon="search"
				onChange={e => setSearch(e.target.value)}
			/>

			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={6} sx={{ gap: 1 }}>
					<TransactionCardSkeleton />
				</ListSkeleton>
			) : filteredTransactions.length ? (
				<Stack gap={1}>
					{filteredTransactions.map((transaction, index) => {
						const isSend = transaction.transaction?.data.sender === profile?.id;
						const txDate = formatDate(new Date(Number(transaction.timestampMs)));
						return (
							<Stack key={transaction.digest} gap={1}>
								{index ? (
									formatDate(new Date(Number(filteredTransactions[index - 1].timestampMs))) !== txDate && (
										<Label mt={1}>{txDate}</Label>
									)
								) : (
									<Label>{txDate}</Label>
								)}

								<TransactionCard
									type={isSend ? 'send' : 'receive'}
									address={
										(isSend
											? (transaction.transaction?.data.transaction as ITransaction)?.inputs[1].value
											: transaction.transaction?.data.sender) || ''
									}
									price={formatNumber(
										Math.abs(
											Number((transaction.transaction?.data.transaction as ITransaction)?.inputs[0].value) /
												Number(MIST_PER_SUI)
										),
										SUI_TOKEN_DECIMALS
									)}
								/>
							</Stack>
						);
					})}
				</Stack>
			) : (
				<NotFound description="No activities" />
			)}
		</Stack>
	);
};
