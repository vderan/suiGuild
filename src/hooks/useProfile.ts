import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useCallback } from 'react';
import { OBJECT_RECORD, ZERO_ADDRESS } from 'src/constants/sui.constants/objectIds';
import { DEFAULT_CHAIN, provider } from 'src/constants/sui.constants/rpc';
import { UserInfo } from 'src/contexts';
import { getBCS } from 'src/helpers/bcs.helpers';

const bcs = getBCS();

export const useProfile = () => {
	const packageObjectId = OBJECT_RECORD[DEFAULT_CHAIN].PACKAGE_ID;
	const profileObjectId = OBJECT_RECORD[DEFAULT_CHAIN].PROFILE_STORE;

	const checkUsername = async (displayName: string) => {
		const txb = new TransactionBlock();
		txb.moveCall({
			target: `${packageObjectId}::profile::check_username`,
			arguments: [txb.object(profileObjectId), txb.pure(bcs.ser('utf8string', displayName).toBytes())]
		});

		const result = await provider.devInspectTransactionBlock({
			transactionBlock: txb,
			sender: ZERO_ADDRESS
		});

		const returnValues = result?.results?.[0]?.returnValues;

		if (returnValues) {
			const usernameExistance = bcs.de(returnValues[0][1], Uint8Array.from(returnValues[0][0]));
			return usernameExistance;
		}
		return false;
	};

	const getUserInfo = useCallback(
		async (address?: string) => {
			if (!address) return null;
			const txb = new TransactionBlock();
			txb.moveCall({
				target: `${packageObjectId}::profile::get_user_profile`,
				arguments: [txb.object(profileObjectId), txb.pure(address)]
			});
			const result = await provider.devInspectTransactionBlock({
				transactionBlock: txb,
				sender: ZERO_ADDRESS
			});

			const r = result?.results?.[0]?.returnValues;
			if (!r) return null;
			return bcs.de('UserProfile', Uint8Array.from(r[0][0])) as UserInfo;
		},
		[packageObjectId, profileObjectId]
	);

	const getUserByName = useCallback(
		async (username?: string) => {
			if (!username) return null;
			const txb = new TransactionBlock();
			txb.moveCall({
				target: `${packageObjectId}::profile::get_user_info_by_username`,
				arguments: [txb.object(profileObjectId), txb.pure(username)]
			});
			const result = await provider.devInspectTransactionBlock({
				transactionBlock: txb,
				sender: ZERO_ADDRESS
			});

			const r = result?.results?.[0]?.returnValues;
			if (!r) return null;
			return bcs.de('UserProfile', Uint8Array.from(r[0][0])) as UserInfo;
		},
		[packageObjectId, profileObjectId]
	);

	return { checkUsername, getUserInfo, getUserByName };
};
