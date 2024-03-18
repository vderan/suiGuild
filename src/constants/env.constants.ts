// TODO: rename base url
export const BASE_URL = import.meta.env.VITE_BASE_URL as string;
export const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string;
export const GAMES_API_KEY = import.meta.env.VITE_GAMES_API_KEY as string;
export const GAMES_API = (import.meta.env.VITE_GAMES_API as string) || 'https://api.rawg.io/api/games';
export const FLAGS_API =
	(import.meta.env.VITE_FLAGS_API as string) || 'https://storage.googleapis.com/dycr-web/image/flags';
