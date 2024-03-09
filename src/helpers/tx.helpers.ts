import { TransactionBlock } from '@mysten/sui.js/transactions';
import { DryRunTransactionBlockResponse, SuiClient, TransactionEffects } from '@mysten/sui.js/client';

export async function dryRunTransactionBlock(
	transactionBlock: TransactionBlock,
	provider: SuiClient
): Promise<DryRunTransactionBlockResponse> {
	const dryRunTxBytes = await transactionBlock.build({
		client: provider
	});

	return provider.dryRunTransactionBlock({
		transactionBlock: dryRunTxBytes
	});
}

export function getTotalGasUsed(effects: TransactionEffects): string {
	const gasSummary = effects?.gasUsed;
	return gasSummary
		? (
				BigInt(gasSummary.computationCost) +
				BigInt(gasSummary.storageCost) -
				BigInt(gasSummary.storageRebate)
		  ).toString()
		: '';
}
