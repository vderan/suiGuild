import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { SUI_CHAIN } from '../env.constants';

export const networks = {
	[SUI_CHAIN]: { url: getFullnodeUrl(SUI_CHAIN) }
};

export const provider = new SuiClient(networks[SUI_CHAIN]);
