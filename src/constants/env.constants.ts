export const XMPP_API_URL = import.meta.env.VITE_XMPP_API_URL as string;
export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL as string;
export const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string;
export const GAMES_API_KEY = import.meta.env.VITE_GAMES_API_KEY as string;
export const IPFS_API = import.meta.env.VITE_IPFS_API as string;
export const XMPP_DOMAIN = import.meta.env.VITE_XMPP_DOMAIN as string;
export const GAMES_API = (import.meta.env.VITE_GAMES_API as string) || 'https://api.rawg.io/api/games';
export const FLAGS_API =
	(import.meta.env.VITE_FLAGS_API as string) || 'https://storage.googleapis.com/dycr-web/image/flags';
export const SUI_CHAIN = (import.meta.env.VITE_SUI_CHAIN as 'testnet' | 'mainnet') || 'testnet';
export const SUI_EXPLORER_API = (import.meta.env.VITE_SUI_EXPLORER_API as string) || 'https://suiexplorer.com';
export const PACKAGE_CONTRACT_ADDR = import.meta.env.VITE_PACKAGE_CONTRACT_ADDR as string;
export const GILDER_CONTRACT_ADDR = import.meta.env.VITE_GILDER_CONTRACT_ADDR as string;
export const PROFILE_STORE_CONTRACT_ADDR = import.meta.env.VITE_PROFILE_STORE_CONTRACT_ADDR as string;
