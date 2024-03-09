export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export const LOCAL_STORAGE = {
	JWT: 'jwt'
};

export const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string;

export const BACKEND_URL = 'https://gilder-backend.vercel.app';

export const REQUEST_SPONSORED_RESPONSE_URL = `${BACKEND_URL}/request_sponsored_response/`;

export const SEND_SPONSORED_TRANSACTION_URL = `${BACKEND_URL}/send_sponsored_transaction/`;

export const GET_SUI_TOKEN_PRICE = `${BACKEND_URL}/get_sui_price`;

export const NOTIFICATION_URL = `${BACKEND_URL}/notification`;

export const MESSAGE_URL = `${BACKEND_URL}/message`;
