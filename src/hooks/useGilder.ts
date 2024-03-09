import { useCallback } from 'react';
import {
	useCurrentWallet,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
	useSignTransactionBlock,
	useSuiClient
} from '@mysten/dapp-kit';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';
import { toast } from 'react-toastify';
import { OBJECT_RECORD, ZERO_ADDRESS } from 'src/constants/sui.constants/objectIds';
import { DEFAULT_CHAIN, provider } from 'src/constants/sui.constants/rpc';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import axios from 'axios';
import { REQUEST_SPONSORED_RESPONSE_URL, SEND_SPONSORED_TRANSACTION_URL } from 'src/constants/api.constants';
import { getBCS } from 'src/helpers/bcs.helpers';
import { IForum, IPost } from 'src/contexts';
import { MAX_PURE_BYTES, MYST_IN_1_SUI } from 'src/constants/constants';
import { dryRunTransactionBlock, getTotalGasUsed } from 'src/helpers/tx.helpers';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { IEditUserProps } from './types';
import { AchievementForm } from 'src/views/ProfileAchievements';
import { TeamForm } from 'src/views/ProfileTeams';
import { AwardForm } from 'src/views/ProfileAwards';
import { ICreateCommunityProps } from 'src/components/Layout/Header';
import { IPostData } from 'src/components/TextEditor';

const bcs = getBCS();

export const useGilder = () => {
	const wallet = useCurrentWallet();
	const account = useCurrentAccount();
	const { mutateAsync: signTransactionBlock } = useSignTransactionBlock();
	const { mutateAsync: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
	const packageObjectId = OBJECT_RECORD[DEFAULT_CHAIN].PACKAGE_ID;
	const gilderObjectId = OBJECT_RECORD[DEFAULT_CHAIN].GILDER_GILDER;
	const profileObjectId = OBJECT_RECORD[DEFAULT_CHAIN].PROFILE_STORE;
	const client = useSuiClient();

	const mintTestNFT = async () => {
		if (!wallet.isConnected && !account) return;
		try {
			const txb = new TransactionBlock();
			txb.moveCall({
				target: `${packageObjectId}::nft::mint`,
				arguments: [txb.pure('Test'), txb.pure('Test'), txb.pure('Test')]
			});
			await signAndExecuteTransactionBlock(
				{
					transactionBlock: txb,
					chain: DEFAULT_CHAIN
				},
				{
					onSuccess: () => toast.success('NFT mint successfully!', { theme: 'colored' })
				}
			);
			return true;
		} catch (err) {
			return false;
		}
	};

	const getNFTs = async () => {
		if (!wallet.isConnected && !account) return;
		const nfts = await provider.getOwnedObjects({
			owner: account?.address || '',
			options: {
				showContent: true,
				showDisplay: true,
				showType: true,
				showBcs: true,
				showOwner: true,
				showPreviousTransaction: true,
				showStorageRebate: true
			},
			filter: {
				MatchNone: [
					{
						StructType: '0x2::coin::Coin'
					}
				]
			}
		});
		try {
			const txb = new TransactionBlock();
			const NFTs = txb.makeMoveVec({ objects: [txb.object(nfts.data[0].data?.objectId || '')] });
			txb.moveCall({
				target: `${packageObjectId}::gilder::transferNFTs`,
				arguments: [NFTs, txb.pure('0xbcfedec0e8713faf497b8195735eb7927ca011b12be8ff9beeed0ff82082f056')],
				typeArguments: [`${packageObjectId}::nft::NFT`]
			});
			await signAndExecuteTransactionBlock({
				transactionBlock: txb,
				chain: DEFAULT_CHAIN
			});
			return true;
		} catch (err) {
			return false;
		}
	};

	const getSuiBallance = async () => {
		if (!account) return 0;
		const ballance = await provider.getAllBalances({ owner: account.address });
		return Number(ballance[0].totalBalance) / MYST_IN_1_SUI;
	};

	const getTransactions = async () => {
		if (!account) return [];
		const transactions = await provider.queryTransactionBlocks({
			filter: {
				ToAddress: account.address
			},
			options: {
				showEffects: true,
				showEvents: true,
				showBalanceChanges: true,
				showInput: true,
				showObjectChanges: true
			}
		});
		return transactions.data;
	};

	const sendSuiToken = async (amount: string, recipient: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
		txb.moveCall({
			target: `${packageObjectId}::gilder::transferSui`,
			arguments: [coin, txb.pure(recipient)]
		});
		await signAndExecuteTransactionBlock({
			transactionBlock: txb,
			chain: DEFAULT_CHAIN
		});
	};
	const esimateSendSuiTokenGas = useCallback(
		async (amount: string, recipient: string) => {
			if (!account?.address) return 0;
			const txb = new TransactionBlock();
			const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
			txb.moveCall({
				target: `${packageObjectId}::gilder::transferSui`,
				arguments: [coin, txb.pure(recipient)]
			});
			txb.setSender(account?.address);
			const data = await dryRunTransactionBlock(txb, client);
			const gas = getTotalGasUsed(data.effects);
			return Number(gas) / Number(MIST_PER_SUI);
		},
		[account?.address, client, packageObjectId]
	);

	const editPersonalInfo = async (user: IEditUserProps) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_personal_info`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(user.avatar),
				txb.pure(user.coverImage),
				txb.pure(bcs.ser('utf8string', user.name).toBytes()),
				txb.pure(bcs.ser('utf8string', user.displayName).toBytes()),
				txb.pure(bcs.ser('utf8string', user.email).toBytes()),
				txb.pure(bcs.ser('utf8string', user.bio).toBytes()),
				txb.pure(bcs.ser('utf8string', user.nation).toBytes()),
				txb.pure(bcs.ser('utf8string', user.language).toBytes()),
				txb.pure(bcs.ser('utf8string', user.website).toBytes()),
				txb.pure(bcs.ser('utf8string', user.socialLinks).toBytes()),
				txb.pure(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
			chain: DEFAULT_CHAIN
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);
	};

	const addGameSummary = async (games: string[]) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_game_summary`,
			arguments: [txb.object(profileObjectId), txb.pure(games)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
			chain: DEFAULT_CHAIN
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new game successfully!', { theme: 'colored' });
	};

	const removeGameSummary = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_game_summary`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
			chain: DEFAULT_CHAIN
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed game summary successfully!', { theme: 'colored' });
	};

	const addAchievement = async (achievementData: AchievementForm) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_achievement`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', achievementData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.description).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.year).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.month).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.team).toBytes()),
				txb.pure(achievementData.place),
				txb.pure(bcs.ser('utf8string', achievementData.link).toBytes()),
				txb.pure(achievementData.cover)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
			chain: DEFAULT_CHAIN
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new achievement successfully!', { theme: 'colored' });
	};

	const editAchievement = async ({ achievementData, idx }: { achievementData: AchievementForm; idx: number }) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_achievement`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', achievementData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.description).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.year).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.month).toBytes()),
				txb.pure(bcs.ser('utf8string', achievementData.team).toBytes()),
				txb.pure(achievementData.place),
				txb.pure(bcs.ser('utf8string', achievementData.link).toBytes()),
				txb.pure(achievementData.cover),
				txb.pure(idx)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Updated achievement successfully!', { theme: 'colored' });
	};

	const removeAchievement = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_achievement`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed achievement successfully!', { theme: 'colored' });
	};

	const addGameSetup = async (name: string, component: string, community: string, coverImage: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_game`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', name).toBytes()),
				txb.pure(bcs.ser('utf8string', component).toBytes()),
				txb.pure(bcs.ser('utf8string', community).toBytes()),
				txb.pure(coverImage)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new game setup successfully!', { theme: 'colored' });
	};

	const editGameSetup = async (
		name: string,
		component: string,
		community: string,
		coverImage: string,
		index: number
	) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_game`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', name).toBytes()),
				txb.pure(bcs.ser('utf8string', component).toBytes()),
				txb.pure(bcs.ser('utf8string', community).toBytes()),
				txb.pure(coverImage),
				txb.pure(index)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Updated game setup successfully!', { theme: 'colored' });
	};

	const removeGameSetup = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_game`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed a game setup successfully!', { theme: 'colored' });
	};

	const addTeam = async (teamData: TeamForm) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_team`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', teamData.name).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.startYear).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.startMonth).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.endYear).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.endMonth).toBytes()),
				txb.pure(teamData.logo)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new team successfully!', { theme: 'colored' });
	};

	const editTeam = async ({ teamData, idx }: { teamData: TeamForm; idx: number }) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_team`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', teamData.name).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.startYear).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.startMonth).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.endYear).toBytes()),
				txb.pure(bcs.ser('utf8string', teamData.endMonth).toBytes()),
				txb.pure(teamData.logo),
				txb.pure(idx)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Updated team successfully!', { theme: 'colored' });
	};

	const removeTeam = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_team`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed a team successfully!', { theme: 'colored' });
	};

	const addVideo = async (name: string, link: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_video`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', name).toBytes()),
				txb.pure(bcs.ser('utf8string', link).toBytes())
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new video successfully!', { theme: 'colored' });
	};

	const editVideo = async (name: string, link: string, index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_video`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', name).toBytes()),
				txb.pure(bcs.ser('utf8string', link).toBytes()),
				txb.pure(index)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Updated video successfully!', { theme: 'colored' });
	};

	const removeVideo = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_video`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed a video successfully!', { theme: 'colored' });
	};

	const addAward = async (awardData: AwardForm) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::add_award`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', awardData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.year).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.month).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.link).toBytes()),
				txb.pure(awardData.cover)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Added a new award successfully!', { theme: 'colored' });
	};

	const editAward = async ({ awardData, idx }: { awardData: AwardForm; idx: number }) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::edit_award`,
			arguments: [
				txb.object(profileObjectId),
				txb.pure(bcs.ser('utf8string', awardData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.year).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.month).toBytes()),
				txb.pure(bcs.ser('utf8string', awardData.link).toBytes()),
				txb.pure(awardData.cover),
				txb.pure(idx)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Updated award successfully!', { theme: 'colored' });
	};

	const removeAward = async (index: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_award`,
			arguments: [txb.object(profileObjectId), txb.pure(index)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed an award successfully!', { theme: 'colored' });
	};

	const createCommunity = async (communityData: ICreateCommunityProps) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::create_community`,
			arguments: [
				txb.object(gilderObjectId),
				txb.object(profileObjectId),
				txb.pure(communityData.avatar),
				txb.pure(communityData.cover),
				txb.pure(false),
				txb.pure(bcs.ser('utf8string', communityData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.description, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.rules, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.links, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.resources, { size: MAX_PURE_BYTES }).toBytes()),
				txb.object(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Created a new community successfully!', { theme: 'colored' });
	};

	const editCommunity = async ({ idx, communityData }: { idx: number; communityData: ICreateCommunityProps }) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::edit_community`,
			arguments: [
				txb.object(gilderObjectId),
				txb.pure(idx),
				txb.pure(communityData.avatar),
				txb.pure(communityData.cover),
				txb.pure(bcs.ser('utf8string', communityData.title).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.description, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.rules, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.links, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(bcs.ser('utf8string', communityData.resources, { size: MAX_PURE_BYTES }).toBytes())
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Edited community successfully!', { theme: 'colored' });
	};

	const getPost = async (pIndex: number) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();

		txb.moveCall({
			target: `${packageObjectId}::gilder::get_post`,
			arguments: [txb.object(gilderObjectId), txb.pure(pIndex)]
		});

		const result = await provider.devInspectTransactionBlock({
			transactionBlock: txb,
			sender: ZERO_ADDRESS
		});

		const r = result?.results?.[0]?.returnValues;
		if (r) {
			return bcs.de('Post', Uint8Array.from(r[0][0])) as IPost;
		}
	};

	const createPost = async (createPostData: IPostData) => {
		if (!wallet.isConnected) return;
		const desc = bcs.ser('utf8string', createPostData.content, { size: 1024 * 256 }).toBytes();
		if (desc.length > MAX_PURE_BYTES) {
			throw new Error(
				`You cannot create a post. ${MAX_PURE_BYTES} bytes allowed, ${desc.length} used. Please reduce the content.`
			);
		}
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::post`,
			arguments: [
				txb.object(gilderObjectId),
				txb.object(profileObjectId),
				txb.pure(createPostData.cId),
				txb.pure(bcs.ser('utf8string', createPostData.title).toBytes()),
				txb.pure(desc),
				txb.pure(createPostData.isDraft),
				txb.pure(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Created a new post successfully!', { theme: 'colored' });
	};

	const editPost = async ({ pId, postData }: { pId: number; postData: IPostData }) => {
		if (!wallet.isConnected) return;
		const desc = bcs.ser('utf8string', postData.content, { size: 1024 * 256 }).toBytes();
		if (desc.length > MAX_PURE_BYTES) {
			throw new Error(
				`You cannot update a post. ${MAX_PURE_BYTES} bytes allowed, ${desc.length} used. Please reduce the content.`
			);
		}
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::edit_post`,
			arguments: [
				txb.object(gilderObjectId),
				txb.pure(pId),
				txb.pure(postData.cId),
				txb.pure(bcs.ser('utf8string', postData.title).toBytes()),
				txb.pure(desc),
				txb.pure(postData.isDraft),
				txb.pure(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success(postData.isDraft ? 'Updated a draft successfully!' : 'Updated a post successfully!', {
			theme: 'colored'
		});
	};

	const createComment = async (cIndex: number, pIndex: number, content: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::comment`,
			arguments: [
				txb.object(gilderObjectId),
				txb.object(profileObjectId),
				txb.pure(cIndex),
				txb.pure(pIndex),
				txb.pure(bcs.ser('utf8string', content, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Created a new comment successfully!', { theme: 'colored' });
	};

	const createReply = async (
		communityId: number,
		postId: number,
		commentId: number,
		parentId: number,
		content: string
	) => {
		if (!account?.address) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::reply`,
			arguments: [
				txb.object(gilderObjectId),
				txb.pure(communityId),
				txb.pure(postId),
				txb.pure(commentId),
				txb.pure(parentId),
				txb.pure(bcs.ser('utf8string', content, { size: MAX_PURE_BYTES }).toBytes()),
				txb.pure(SUI_CLOCK_OBJECT_ID)
			]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Created a new reply successfully!', { theme: 'colored' });
	};

	const follow = async (cIndex: number) => {
		if (!account?.address) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::follow`,
			arguments: [txb.object(gilderObjectId), txb.object(profileObjectId), txb.pure(cIndex)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Joined successfully!', { theme: 'colored' });
	};

	const unfollow = async (cIndex: number) => {
		if (!account?.address) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::gilder::unfollow`,
			arguments: [txb.object(gilderObjectId), txb.object(profileObjectId), txb.pure(cIndex)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Left successfully!', { theme: 'colored' });
	};

	const vote = async (postIndex: number) => {
		if (!account?.address) return;
		const txb = new TransactionBlock();
		const post = await getPost(postIndex);
		const isOwner = `0x${post?.creatorInfo}` === account.address;
		const isAlreadyVoted = post?.voted.find(address => `0x${address}` === account.address);

		if (isOwner || isAlreadyVoted) {
			toast.warning(isAlreadyVoted ? "You're already voted to this post" : 'You cannot vote in your own post!', {
				theme: 'colored'
			});
			return;
		}
		const txbody = {
			target: `${packageObjectId}::gilder::vote`,
			arguments: [txb.object(gilderObjectId), txb.pure(postIndex)]
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, {
			transactionBody: txbody,
			senderAddress: account.address
		});
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		});

		toast.success('Voted successfully!', { theme: 'colored' });
	};

	const getAllCommunities = useCallback(async () => {
		const txb = new TransactionBlock();

		txb.moveCall({
			target: `${packageObjectId}::gilder::get_community`,
			arguments: [txb.object(gilderObjectId)]
		});

		const result = await provider.devInspectTransactionBlock({
			transactionBlock: txb,
			sender: ZERO_ADDRESS
		});

		const r = result?.results?.[0]?.returnValues;
		if (!r) return [];
		return bcs.de('vector<Community>', Uint8Array.from(r[0][0])) as IForum[];
	}, [gilderObjectId, packageObjectId]);

	const getPosts = useCallback(async () => {
		const txb = new TransactionBlock();

		txb.moveCall({
			target: `${packageObjectId}::gilder::get_posts`,
			arguments: [txb.object(gilderObjectId)]
		});

		const result = await provider.devInspectTransactionBlock({
			transactionBlock: txb,
			sender: ZERO_ADDRESS
		});

		const r = result?.results?.[0]?.returnValues;
		if (!r) return [];
		const posts = bcs.de('vector<Post>', Uint8Array.from(r[0][0])) as IPost[];
		return posts.filter(post => !post.isDraft);
	}, [gilderObjectId, packageObjectId]);

	const getUserDrafts = useCallback(
		async (_userId: string) => {
			const txb = new TransactionBlock();

			txb.moveCall({
				target: `${packageObjectId}::gilder::get_posts`,
				arguments: [txb.object(gilderObjectId)]
			});

			const result = await provider.devInspectTransactionBlock({
				transactionBlock: txb,
				sender: ZERO_ADDRESS
			});

			const r = result?.results?.[0]?.returnValues;
			if (!r) return [];
			const posts = bcs.de('vector<Post>', Uint8Array.from(r[0][0])) as IPost[];
			return posts
				.filter(post => `0x${post.creatorInfo}` === _userId && post.isDraft)
				.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
		},
		[gilderObjectId, packageObjectId]
	);

	const getUsernames = useCallback(async () => {
		const txb = new TransactionBlock();

		txb.moveCall({
			target: `${packageObjectId}::profile::get_usernames`,
			arguments: [txb.object(profileObjectId)]
		});

		const result = await provider.devInspectTransactionBlock({
			transactionBlock: txb,
			sender: ZERO_ADDRESS
		});

		const r = result?.results?.[0]?.returnValues;
		if (r) {
			return bcs.de('vector<utf8string>', Uint8Array.from(r[0][0])) as string[];
		}
	}, [packageObjectId, profileObjectId]);

	const sendFriendRequest = async (friendname: string, username: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::friend_request`,
			arguments: [txb.object(profileObjectId), txb.pure(friendname), txb.pure(username)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Sent friend request!', { theme: 'colored' });
	};

	const acceptFriendRequest = async (friendname: string, username: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::accept_friend`,
			arguments: [txb.object(profileObjectId), txb.pure(friendname), txb.pure(username)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Accepted friend request!', { theme: 'colored' });
	};

	const rejectFriendRequest = async (friendname: string, username: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::reject_friend`,
			arguments: [txb.object(profileObjectId), txb.pure(friendname), txb.pure(username)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Declined friend request!', { theme: 'colored' });
	};

	const removeFriend = async (friendname: string, username: string) => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::remove_friend`,
			arguments: [txb.object(profileObjectId), txb.pure(friendname), txb.pure(username)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);

		toast.success('Removed friend successfully!', { theme: 'colored' });
	};

	const deactivateAccount = async () => {
		if (!wallet.isConnected) return;
		const txb = new TransactionBlock();
		const txbody = {
			target: `${packageObjectId}::profile::deactivate_account`,
			arguments: [txb.object(profileObjectId)]
		};

		const sponsoredTransactionRequestParam = {
			transactionBody: txbody,
			senderAddress: account?.address
		};

		const sponsoredResponseResult = await axios.post(REQUEST_SPONSORED_RESPONSE_URL, sponsoredTransactionRequestParam);
		const sponsoredResponse = sponsoredResponseResult.data;

		const userSignature = await signTransactionBlock({
			transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes)
		});

		const sponsoredTransactionExecutionParam = {
			userSignature: userSignature.signature,
			txBytes: sponsoredResponse.txBytes,
			responseSignature: sponsoredResponse.signature
		};

		await axios.post(SEND_SPONSORED_TRANSACTION_URL, sponsoredTransactionExecutionParam);
	};

	return {
		getSuiBallance,
		getTransactions,
		sendSuiToken,
		editPersonalInfo,
		addGameSummary,
		removeGameSummary,
		addAchievement,
		editAchievement,
		removeAchievement,
		addGameSetup,
		editGameSetup,
		removeGameSetup,
		addTeam,
		editTeam,
		removeTeam,
		addVideo,
		editVideo,
		removeVideo,
		addAward,
		editAward,
		removeAward,
		getAllCommunities,
		getPosts,
		getUserDrafts,
		createCommunity,
		editCommunity,
		createPost,
		editPost,
		createComment,
		createReply,
		follow,
		unfollow,
		vote,
		mintTestNFT,
		getNFTs,
		esimateSendSuiTokenGas,
		getUsernames,
		sendFriendRequest,
		acceptFriendRequest,
		rejectFriendRequest,
		removeFriend,
		deactivateAccount
	};
};
