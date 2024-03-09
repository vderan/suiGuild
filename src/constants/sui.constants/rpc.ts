import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export const networks = {
	localnet: { url: getFullnodeUrl('localnet') },
	devnet: { url: getFullnodeUrl('devnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') }
};

export const provider = new SuiClient(networks.testnet);

export const SUI_MAIN_NET_CHAIN = 'sui:mainnet';

export const SUI_DEV_NET_CHAIN = 'sui:devnet';

export const SUI_TEST_NET_CHAIN = 'sui:testnet';

export const DEFAULT_CHAIN = SUI_TEST_NET_CHAIN;

export type SUI_CHAIN_TYPE = typeof SUI_DEV_NET_CHAIN | typeof SUI_MAIN_NET_CHAIN | typeof SUI_TEST_NET_CHAIN;
