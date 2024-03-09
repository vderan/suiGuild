import axios from 'axios';
import { GET_SUI_TOKEN_PRICE } from 'src/constants/api.constants';

export const getTokenPrice = async (): Promise<number> => {
	const tokenPrice = await axios.get(GET_SUI_TOKEN_PRICE);
	return tokenPrice.data.price;
};
