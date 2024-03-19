import axios from 'axios';
import { GAMES_API, GAMES_API_KEY } from 'src/constants/env.constants';

type Game = {
	id: number;
	name: string;
	background_image: string;
};
type Games = {
	results: Game[];
};

export const getGames = async (search: string) => {
	const { data } = await axios<Games>({
		method: 'get',
		url: GAMES_API,
		params: {
			key: GAMES_API_KEY,
			page_size: 100,
			search_precise: true,
			search_exact: true,
			search
		}
	});
	return data.results;
};

export const getGameDetails = async (id: string) => {
	const { data } = await axios<Game>({
		method: 'get',
		url: `${GAMES_API}/${id}`,
		params: {
			key: GAMES_API_KEY
		}
	});

	return data;
};
